import {sampleSize} from 'lodash';
import {select} from 'd3';

import {parse} from './visualizations/model';
import {colorHistogram} from './visualizations/color-histogram';
import {scatter} from './visualizations/scatter';

import rawData from './data/yt8m_sample_stats.json';

const data = parse(rawData);
const red = colorHistogram("red");
const green = colorHistogram("green");
const blue = colorHistogram("blue");

red.extent([
  [10, 0],
  [490, 100]
]);
blue.extent([
  [10, 100],
  [490, 200]
]);
green.extent([
  [10, 200],
  [490, 300]
]);

const svg = select("body")
  .append("svg")
    .attr("width", 1000)
    .attr("height", 500);

const thumbnail = select("body")
  .append("div")
  .style("width", "1000px");

const g = svg.append("g");
const g2 = svg.append("g");
const g3 = svg.append("g");

const gs = svg.append("g");
const s = scatter(ids => {
  ids = ids || [];
  const firstIds = ids.slice(0, 20);
  ids = new Set(ids);
  const subset = data.filter(d => ids.has(d.id));
  g.call(red, subset);
  g2.call(blue, subset);
  g3.call(green, subset);

  const imgs = thumbnail.selectAll("img")
    .data(firstIds)

  imgs.exit().remove();

  imgs.enter()
    .append("img")
  .merge(imgs)
    .attr("src", d => `./img/${d}.jpg`);
});

s.extent([
  [500, 0],
  [1000, 500]
]);

gs.call(s, data);


g.call(red, data);
g2.call(blue, data);
g3.call(green, data);
