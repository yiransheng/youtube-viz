import {
  debounce
} from 'lodash';
import {
  event,
  scaleLinear,
  scalePow,
  axisLeft,
  axisBottom,
  transpose,
  extent,
  brush
} from 'd3';


export function scatter(onBrushCallback) {

  // onBrushCallback = debounce(onBrushCallback, 50);

  const x = scaleLinear();
  const y = scaleLinear();

  const xAxis = axisBottom().scale(x); 
  const yAxis = axisLeft().scale(y);

  function onBrush(plot) {
    const ext = event.selection; 
    const ids = [];
    plot.selectAll("circle")
      .each(function(d) {
        if (inExtent(d, ext)) {
          ids.push(d.id);
        }
      });

    if (ids.length && onBrushCallback) {
      onBrushCallback(ids);
    }
  }

  function inExtent(d, ext) {
    if (!ext) {
      return true;
    }
    const _x = x(d.dislikeCount);
    const _y = y(d.likeCount); 

    const [[x0, y0], [x1, y1]] = ext;

    return x0 <= _x && _x <= x1 &&
      y0 <= _y && _y <= y1;
  }


  function draw(el, data) {

    const [x0, x1] = x.range();
    const [y1, y0] = y.range();

    let gx = el.select("g.x_axis");
    let gy = el.select("g.y_axis");

    if (gx.empty()) {
      gx = el.append("g").classed("x_axis", true)
        .attr("transform", `translate(0, ${y1+25})`);
      
      el.append("text")
        .attr("transform", `translate(${x1-40}, ${y1+15})`)
        .attr("font-size", "10px")
        .text("Dislike Count");
    }
    if (gy.empty()) {
      gy = el.append("g").classed("y_axis", true)
        .attr("transform", `translate(${x0-25}, 0)`);
      el.append("text")
        .attr("transform", `translate(${x0-10}, ${y0})`)
        .attr("font-size", "10px")
        .attr("writing-mode", "tb-rl")
        .text("Like Count");
    }


    let plot = el.select("g.plot");
    if (plot.empty()) {
      const brsh= brush();
      plot = el.append("g").classed("plot", true);
      const brushArea = el.append("g");
      brsh.on("brush", function () {
        onBrush(plot);
      });
      brsh.on("end", function () {
        onBrush(plot);
      });
      brushArea.call(brsh)
    }
    const circ = plot.selectAll("circle")
      .data(data, d => d.id);

    x.domain(extent(data, d=>d.dislikeCount)).nice();
    y.domain(extent(data, d=>d.likeCount)).nice();

    gx.call(xAxis);
    gy.call(yAxis);


    circ.exit()
      .transition()
        .attr("r", 0)
        .remove();

    circ.enter()
      .append("circle")
        .attr("r", 0)
        .attr("cx", d => x(d.dislikeCount))
        .attr("cy", d => y(d.likeCount))
        .attr("fill", d => d.dominant_color)
      .merge(circ)
        .transition()
        .attr("r", 5)
        .attr("cx", d => x(d.dislikeCount))
        .attr("cy", d => y(d.likeCount));
  }

  draw.extent = (ext) => {
    const mar = 50;
    if (!ext) {
      const [x0, x1] = x.range();
      const [y1, y0] = y.range();

      return transpose([
        [x0 - mar, x1+mar],
        [y0 + mar, y1-mar]
      ]);
    }
    const [xr, yr] = transpose(ext);
    const [y1, y0] = yr
    const [x0, x1] = xr;

    x.range([x0+mar, x1-mar]);
    y.range([y0-mar, y1+mar]);

    return draw;
  }

  return draw;
}
