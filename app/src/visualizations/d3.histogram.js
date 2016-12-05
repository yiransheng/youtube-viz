import {
  event as d3event,
  histogram,
  select,
  selectAll,
  scaleLinear,
  axisBottom,
  axisTop,
  max,
  extent,
  brushX
} from 'd3';


function getBins(data, accessor, xScale) {
  data = accessor ? data.map(accessor) : data;
  // data = data.filter(d => !isNaN(d) && d < Infinity && d >-Infinity);
  const hist = histogram();

  if (xScale) {
    hist.domain(xScale.domain())
      .thresholds(xScale.ticks(16))
  } else {
    hist.thresholds(25);
  }


  return hist(data);
}

function roughlyEqual(a, b) {
  if (a === b) {
    return true;
  } else {
    return Math.abs(a - b) < 0.1;
  }
}

function rangeLen([a, b]) {
  return Math.abs(a-b);
}

function getLayer(container, className) {
  const layer = container.select("." + className);
  if (layer.empty()) {
    return container.append("g").classed(className, true);
  } else {
    return layer;
  }
}


export function continuous() {

  let node = null;

  let _value = d=>d;
  let _group = null;
  let _xScale = scaleLinear().range([0, 250]);
  let _yScale = scaleLinear().range([150, 0]);
  let _colorScale;
  let _margin = [50, 50];
  let _title = "Histogram";

  let _onBrush = null;
  let _width = 260;
  let _height = 220;


  // getter-setters
  const groupBy = (v) => v ? (_group=v, api) : _group;
  const value   = (v) => v ? (_value=v, api) : _value;
  const title   = (v) => v ? (_title=v, api) : _title;
  const onBrush = (v) => v ? (_onBrush=v, api) : _onBrush;

  const width = (v) => {
    if (v) {
      _width = v;
      _xScale.range([0, v-10]);
      return api;
    }
    return _width;
  }
  const height = (v) => {
    if (v) {
      _height = v;
      _yScale.range([v - 70, 0]);
      return api;
    }
    return _height;
  }


  const barBrush = brushX().handleSize(4);
  let brushExtent = null;

  const brush = (v) => (v || v === null) ? (brushExtent = v, api) : brushExtent;


  // render api
  const mount = data => domNode => {
    node = domNode;
    const [xOffset, yOffset] = [5, 36];
    const selection = 
      getLayer(domNode, "bars")
        .attr("transform", `translate(${xOffset}, ${yOffset})`);

    _xScale.domain(extent(data, _value)).nice();
    const bins = getBins(data, _value, _xScale);

    _yScale.domain([0, max(bins, d=>d.length)]); 

    const width = rangeLen(_xScale.range()) // - xPad * 2;
    const height = rangeLen(_yScale.range()) //- yPad * 2;

    // grids
    const gridlines = axisTop()
                    .tickFormat("")
                    .tickSize(-height-2)
                    .scale(_xScale);
    getLayer(domNode, "grids")
      .html("")
      .attr("transform", `translate(${xOffset}, ${yOffset})`)
      .call(gridlines);

    /* Bars */

    // clear domNode
    selection.html('');

    const binWidth = bins.length > 1 ? 
      (_xScale(bins[1].x1) - _xScale(bins[1].x0)) :
      width;

    const bars = selection.selectAll('.hist-bar')
      .data(bins)
      .enter()
      .append("g").classed("hist-bar", true)
        .attr("transform", d => `translate(${width / 2}, ${_yScale(d.length)})`);

    bars
      .append("rect")
        .attr("fill", d=> {
          if (!brushExtent) return 'steelblue';
          const [x0, x1] = brushExtent;
          if (x0 > x1) return 'steelblue';
          return (d.x1 >= x0 && d.x0 <= x1) ? 'chocolate' : 'steelblue';
        })
        .attr("width", binWidth - 2)
        .attr("height", height);

    bars.transition()
      // .duration(800)
      .attr("transform", d => `translate(${_xScale(d.x0)}, ${_yScale(d.length)})`)
      .each(function (d) {
        select(this).select("rect")
          .attr("height", d=> height - _yScale(d.length));
      });

    // axis
    const xAxis = axisBottom().scale(_xScale).ticks(5);
    const gAxis = getLayer(domNode, "x-axis")
      .html("")
      .attr("transform", `translate(${xOffset}, ${_yScale.range()[0] + yOffset + 2})`)
      .call(xAxis);

    // title
    const gTitle = getLayer(domNode, "x-title")
      .html("")
      .attr("transform", `translate(${xOffset}, 2)`)

    gTitle.append("text")
      .attr("dy", "1em")
      .text(_title);

    // bursh
    const gBrush = getLayer(domNode, "brush")
      .html("")
      .attr("transform", `translate(${xOffset}, ${yOffset})`)

    barBrush
      .extent([[0, 0], [width, height]])
      .on("end", function() {
        const [x0, x1] = brushRange(d3event);
        const be = brushExtent || [-Infinity, Infinity];
        if (_onBrush && 
            !(roughlyEqual(x0, be[0]) && roughlyEqual(x1, be[1]))) _onBrush([x0, x1]);
      });

    gBrush.call(barBrush);
    let brushLoc = null;
    if (brushExtent && brushExtent[0] > -Infinity) {
      brushLoc = brushExtent.map(_xScale);
    }
    barBrush.move(gBrush, brushLoc);
  };

  const update = (data) => {
    if (!node) return;
    const domNode = node;
    const [xOffset, yOffset] = [5, 36];
    const selection = 
      getLayer(domNode, "bars");

    _xScale.domain(extent(data, _value)).nice();
    const bins = getBins(data, _value, _xScale);
    _yScale.domain([0, max(bins, d=>d.length)]); 


    /* Bars */

    const width = rangeLen(_xScale.range());
    const height = rangeLen(_yScale.range());
    const binWidth = bins.length > 1 ? 
      (_xScale(bins[1].x1) - _xScale(bins[1].x0)) :
      width;

    const barsAll = selection.selectAll('.hist-bar')
      .data(bins);


    const barsEnter = barsAll
      .enter()
      .append("g").classed("hist-bar", true);
    barsEnter
      .append("rect")

    const bars = barsEnter.merge(barsAll)
    bars
      .attr("transform", d => `translate(${_xScale(d.x0)}, ${_yScale(d.length)})`)
      .each(function (d) {
        select(this).select("rect")
          .attr("height", d=> height - _yScale(d.length))
          .attr("width", binWidth - 2)
          .attr("fill", ()=> {
            if (!brushExtent) return 'steelblue';
            const [x0, x1] = brushExtent;
            if (x0 > x1) return 'steelblue';
            return (d.x1 >= x0 && d.x0 <= x1) ? 'chocolate' : 'steelblue';
          })
      });
    barsAll.exit().remove();

    // axis
    const xAxis = axisBottom().scale(_xScale).ticks(5);
    const gAxis = getLayer(domNode, "x-axis")
      .attr("transform", `translate(${xOffset}, ${_yScale.range()[0] + yOffset + 2})`)
      .call(xAxis);
    // title
    const gTitle = getLayer(domNode, "x-title")
      .html("")
      .attr("transform", `translate(${xOffset}, 2)`)

    gTitle.append("text")
      .attr("dy", "1em")
      .text(_title);

    // bursh
    const gBrush = getLayer(domNode, "brush");

    barBrush
      .extent([[0, 0], [width, height]]);
    gBrush.call(barBrush);
    let brushLoc = null;
    if (brushExtent && brushExtent[0] > -Infinity) {
      brushLoc = brushExtent.map(_xScale);
    }
    barBrush
      .move(gBrush, brushLoc);
  }

  const unmount = () => {
    barBrush.on("brush", null);
    barBrush.on("end", null);
  }

  function brushRange(d3event) {
    const {selection} = d3event || {};
    if (!selection) return [-Infinity, Infinity];
    const [from, to] = selection;
    const x0 = _xScale.invert(from);
    const x1 = _xScale.invert(to);
    return [x0, x1];
  }



  const api = {
    value,
    mount,
    unmount,
    onBrush,
    title,
    update,
    width,
    height,
    brush
  };

  return api;
}
