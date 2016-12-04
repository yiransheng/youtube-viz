import {sortBy} from 'lodash';
import Plottable from 'plottable/plottable';
import React, {Component} from 'react';

const colorPalette = ["#7AC36A", "#5A9BD4", "#FAA75B", "#9E67AB", "#CE7058", "#D77FB4", "#F15A60", "#737373"];

function durationDays(from, to) {
  return Math.abs(to - from) / 1000 / 3600 / 24;
}

function createBarChart({data, metricLabel, dataRefined, dimensionKey, metricKey}) {
  // const plot = new Plottable.Plots.Bar("vertical");
  const plot = new Plottable.Plots.Line();
  const isTime = data && data.length && (data[0].x instanceof Date);
  const x = isTime 
    ? new Plottable.Scales.Time()
    : new Plottable.Scales.Category();
  const y = new Plottable.Scales.Linear();
  const xAxis = isTime 
    ? new Plottable.Axes.Time(x, "bottom")
    : new Plottable.Axes.Category(x, "bottom").tickLabelAngle(90);
  const yAxis = new Plottable.Axes.Numeric(y, "left");

  if (isTime) {
    data = sortBy(data, d=>d.x);
    dataRefined = sortBy(dataRefined, d=>d.x);
  }

  const data1 = new Plottable.Dataset(data);
  const data2 = new Plottable.Dataset(dataRefined);

  plot.addDataset(data1);
  plot
    .x(d => d[dimensionKey], x)
    .y(d => d[metricKey], y)
    // .attr("fill", colorPalette[0]);
  const pzi = new Plottable.Interactions.PanZoom();
  pzi.addXScale(x);
  pzi.attachTo(plot);

  const pziXAxis = new Plottable.Interactions.PanZoom();
  pziXAxis.addXScale(x);
  pziXAxis.attachTo(xAxis);

  function onPanZoom() {
    const timeRange = durationDays(...x.domain());
    const oldDataset = plot.datasets()[0];
    const newDataset = timeRange > 365 ? data1 : data2;
    if (oldDataset !== newDataset) {
      plot.datasets([newDataset]);
      const isMonthly = plot.datasets()[0] === data1;
      const title = `Median ${isMonthly ? 'Monthly' : 'Daily'} ${metricLabel}`;
      titleLabel.text(title);
    }
  }
  pzi.onZoomEnd(onPanZoom);
  pzi.onPanEnd(onPanZoom);
  pziXAxis.onZoomEnd(onPanZoom);
  pziXAxis.onPanEnd(onPanZoom);

  const gridlines = new Plottable.Components.Gridlines(x, y);
  const body = new Plottable.Components.Group([gridlines, plot]);

  const isMonthly = plot.datasets()[0] === data1;
  const title = `Median ${isMonthly ? 'Monthly' : 'Daily'} ${metricLabel}`;
  const titleLabel = new Plottable.Components.TitleLabel(title);

  const table = new Plottable.Components.Table([
    [null, titleLabel],
    [yAxis, body],
    [null, xAxis]
  ]);

  return table;
}

export default class BarChart extends Component {

  componentDidMount() {
    this._chart = createBarChart(this.props);
    this._chart.renderTo(this.refs.svg);
  }
  componentDidUpdate() {
    this._chart && this._chart.destroy();
    this._chart = createBarChart(this.props);
    this._chart.renderTo(this.refs.svg);
  }
  componentWillUnmount() {
    this._chart && this._chart.destroy();
  }

  render() {
    return (
      <div className="asp-ratio-wrapper">
        <div className="asp-ratio-inner">
          <svg ref="svg" 
            width={880}
            height={360}
            />
        </div>
      </div>
    );
  }
}
