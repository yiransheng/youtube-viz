import {
  min,
  max,
  extent,
  range,
  median,
  mean
} from 'd3';
import {isNumber, groupBy, toPairs, fromPairs} from 'lodash';
import moment from 'moment';
import {sortBy} from 'lodash';
import Plottable from 'plottable/plottable';
import React, {Component} from 'react';

import Plot from './PlottableTimeline';

const colorPalette = ["#7AC36A", "#5A9BD4", "#FAA75B", "#9E67AB", "#CE7058", "#D77FB4", "#F15A60", "#737373"];

function durationDays(from, to) {
  return Math.abs(to - from) / 1000 / 3600 / 24;
}

function digitizeTime(date) {
  const start = moment(date).startOf("day").toDate().getTime();
  const milsecs = date.getTime() - start;
  // half an hour
  const roundMilsecs = Math.floor(milsecs / 1800000) * 1800000;
  return new Date(start + roundMilsecs);
}
function summarize(data, func=median) {
  const grouped = toPairs(groupBy(data, d=>digitizeTime(d.x)));
  const newData = grouped.map(([key, values]) => {
    const y = func(values, d=>d.y);
    const x = moment(key).toDate();
    return {x, y};
  });
  return sortBy(newData, d=>d.x);
}

function createTimingChart({data, metricLabel, dataRefined, dimensionKey, metricKey}) {
  const x = new Plottable.Scales.Time()
  const y = new Plottable.Scales.Linear();


  const plot = new Plot();

  plot.x(d=>d.x, x)
    .y(d=>d.y, y)

  const xMin = min(data, d=>d.x);
  const xMax = max(data, d=>d.x.getTime() + d.duration);
  x.domain([new Date(xMin), new Date(xMax)]);

  const dataset = new Plottable.Dataset(data);
  plot.addDataset(dataset);

  const xAxis = new Plottable.Axes.Time(x, "bottom");
  const yAxis = new Plottable.Axes.Numeric(y, "left");

  const pzi = new Plottable.Interactions.PanZoom();
  pzi.addYScale(y);
  pzi.attachTo(plot);

  const pziXAxis = new Plottable.Interactions.PanZoom();
  pziXAxis.addXScale(x);
  pziXAxis.attachTo(xAxis);

  const pziYAxis = new Plottable.Interactions.PanZoom();
  pziYAxis.addYScale(y);
  pziYAxis.attachTo(yAxis);

  const dataByHourMedian = new Plottable.Dataset(summarize(data));
  // const dataByHourMean = new Plottable.Dataset(summarize(data, mean));
  const hourlyPlot = new Plottable.Plots.Bar();
  hourlyPlot.x(d=>d.x, x)
    .y(d=>d.y, y)
    .attr("stroke", (d, i, dataset) => {
      return dataset !== dataByHourMedian ? colorPalette[0] : colorPalette[1];
    });
  hourlyPlot.addDataset(dataByHourMedian);
  // hourlyPlot.addDataset(dataByHourMean);

  const domainData = dataByHourMedian.data().filter(d=> isNumber(d.y) && !isNaN(d.y));

  y.domain([min(domainData, d=>d.y), max(domainData, d=>d.y) * 2.5]);

  const gridlines = new Plottable.Components.Gridlines(x, y);
  const body = new Plottable.Components.Group([gridlines, hourlyPlot, plot]);
  const table = new Plottable.Components.Table([
    // [null, titleLabel],
    [yAxis, body],
    [null, xAxis]
  ]);
  return table;
}

export default class TimingChart extends Component {

  componentDidMount() {
    this._chart = createTimingChart(this.props);
    this._chart.renderTo(this.refs.svg);
  }
  componentDidUpdate() {
    this._chart && this._chart.destroy();
    this._chart = createTimingChart(this.props);
    this._chart.renderTo(this.refs.svg);
  }
  componentWillUnmount() {
    this._chart && this._chart.destroy();
  }

  render() {
    const {dimensions={width:880,height:360}} = this.props;
    return (
      <div className="sq-ratio-wrapper">
        <div className="asp-ratio-inner">
          <svg ref="svg" 
            width={dimensions.width}
            height={dimensions.height}
            />
        </div>
      </div>
    );
  }
}
