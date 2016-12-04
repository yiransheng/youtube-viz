import plottable from 'plottable/plottable';
import React, {Component} from 'react';

// const colorPalette = ["#7AC36A", "#5A9BD4", "#FAA75B", "#9E67AB", "#CE7058", "#D77FB4", "#F15A60", "#737373"];
function createBarChart({data, dimensionKey, metrickKey}) {
  const plot = new Plottable.Plots.Bar("vertical");
  const x = new Plottable.Scales.Category();
  const y = new Plottable.Scales.Linear();
  const xAxis = new Plottable.Axes.Category(x, "bottom").tickLabelAngle(90);
  const yAxis = new Plottable.Axes.Numeric(y, "left");

  plot.addDataset(new Plottable.Dataset(data))
    .x(d => d[dimensionKey])
    .y(d => d[metricKey]);

  const table = new Plottable.Components.Table([
    [y, plot],
    [null, x]
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
  }
  componentWillUnmount() {
    this._chart && this._chart.destroy();
  }

  render() {
    return (
      <svg ref="svg" 
        />
    );
  }
}
