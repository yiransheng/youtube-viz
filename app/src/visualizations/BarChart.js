import {sortBy} from 'lodash';
import Plottable from 'plottable/plottable';
import React, {Component} from 'react';

const colorPalette = ["#7AC36A", "#5A9BD4", "#FAA75B", "#9E67AB", "#CE7058", "#D77FB4", "#F15A60", "#737373"];
function createBarChart({data, dimensionKey, metricKey}) {
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
  }

  plot.addDataset(new Plottable.Dataset(data));
  plot
    .x(d => d[dimensionKey], x)
    .y(d => d[metricKey], y)
    // .attr("fill", colorPalette[0]);

  const table = new Plottable.Components.Table([
    [yAxis, plot],
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
            height={500}
            />
        </div>
      </div>
    );
  }
}
