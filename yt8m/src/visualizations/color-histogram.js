import {
  first,
  last,
  reverse
} from 'lodash';
import {
  scaleLinear,
  transpose
} from 'd3';

import {
  summarizeColor
} from './model';

export function colorSummary(channel) {

  let xRange = [0, 200];
  let yRange = [50, 0];
  let bins = [];

  const scaleX = scaleLinear().range(xRange);
  const scaleY = scaleLinear().range(yRange);
  const scaleW = scaleLinear();

  const data = (data) => {
    bins = summarizeColor(data, channel); 
    const domain = [first(bins).x0, last(bins).x0];
    const totalWidth = Math.abs(xRange[1] - xRange[0]);
    const width = totalWidth / bins.length - 1;
    const maxCount = Math.ceil(Math.max(...bins.map(b => b.length)) * 1.1);

    scaleW.domain(domain).range([width, width]);
    scaleX.domain(domain);
    scaleY.domain([0, maxCount]);

    return api;
  };

  const rangeX = (x) => {
    xRange = x;
    const totalWidth = Math.abs(xRange[1] - xRange[0]);
    const width = totalWidth / bins.length - 1;

    scaleW.range([width, width]);
    scaleX.range(xRange);

    return api;
  }
  const rangeY = (y) => {
    yRange = y;
    scaleY.range(yRange);

    return api;
  }

  const extent = (ext) => {
    if (!ext) {
      return transpose([xRange, reverse([...yRange])]);
    }
    const [x, y] = transpose(ext);
    const [y1, y2] = y;
    rangeX(x);
    rangeY([y2, y1]);
    return api;
  }

  const api = {
    scaleX,
    scaleY,
    scaleW,
    extent,
    data,
    bins() {
      return bins;
    },
    channel() {
      return channel;
    }
  };

  return api;
}

export function colorHistogram(channel) {
  const summ = colorSummary(channel);

  function draw(el, data) {
    summ.data(data);

    const [[x0, x1], [y0, y1]] = summ.extent();

    const rects = el.selectAll("rect")
      .data(summ.bins());

    rects.exit()
      .transition()
        .attr("height", 0)
        .remove();

    rects.enter()
      .append("rect")
        .attr("fill", summ.channel())
        .attr("x", d => summ.scaleX(d.x0))
        .attr("y", y1)
        .attr("width", d => summ.scaleW(d.x0))
        .attr("height", 0)
      .merge(rects)
        .transition()
        .attr("x", d => summ.scaleX(d.x0))
        .attr("y", d => summ.scaleY(d.length))
        .attr("width", d => summ.scaleW(d.x0))
        .attr("height", d => y1 - summ.scaleY(d.length));
  }

  draw.extent = (ext) => {
    if (!ext) {
      return summ.extent();
    }
    summ.extent(ext);
    return draw;
  }

  return draw;
}

