import Plottable from 'plottable/plottable'
import React, {Component} from 'react';

import {
  min,
  max
} from 'd3';

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length !== values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];

    var x0 = min(values_x);
    var x1 = max(values_x);

    return [
      [x0, m * x0 + b],
      [x1, m * x1 + b]
    ]
}


function createScatterPlot({data, metric_x_label, metric_y_label, metric_x, metric_y}) {
    var xScale = new Plottable.Scales.Linear();
    var yScale = new Plottable.Scales.Linear();

    var metric_x_label = metric_x_label || "X";
    var metric_y_label = metric_y_label || "Y";

    var xs = data.map(d=>d[metric_x]);
    var ys = data.map(d=>d[metric_y]);

    var regressionData = new Plottable.Dataset(findLineByLeastSquares(xs, ys));

    var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");

    const title = `${metric_y_label} versus ${metric_x_label}`;
    const titleLabel = new Plottable.Components.TitleLabel(title);
    const xTitle = metric_x_label;
    var xTitleLabel = new Plottable.Components.AxisLabel(xTitle);
    const yTitle = metric_y_label;
    var yTitleLabel = new Plottable.Components.AxisLabel(yTitle).angle(-90);

    var plot = new Plottable.Plots.Scatter()
        .addDataset(new Plottable.Dataset(data))
        .x(function(d) { return d[metric_x]; }, xScale)
        .y(function(d) { return d[metric_y]; }, yScale)
        .size(function (d) {return d["radius"]; });

    var interaction = new Plottable.Interactions.Pointer();
    interaction.onPointerMove(function (b) {
        plot.entities().forEach(function (entity) {
            entity.selection.attr("fill", "steelblue");
        });
        var entity = plot.entityNearest(b);
        entity && entity
            .selection
            .attr("fill", "orange");
        title.text(entity.datum.radius);
    });
    interaction.offPointerMove(function (b) {
        plot.entities().forEach(function (entity) {
            entity.selection.attr("fill", "steelblue");
        });
        var entity = plot.entityNearest(b);
        entity && entity.selection.attr("fill", "steelblue");
    });
    interaction.attachTo(plot);

    var line = new Plottable.Plots.Line()
      .addDataset(regressionData)
      .attr("stroke", "black")
      .x(d => d[0], xScale)
      .y(d => d[1], yScale);

    const body = new Plottable.Components.Group([plot, line]);
    const legend = new Plottable.Components.Legend(xScale);

    var table = new Plottable.Components.Table([
        [null, null, null, null],
        [yTitleLabel, yAxis, body, legend],
        [null, null, xAxis, null],
        [null, null, xTitleLabel, null]
    ]);

    return table;
}

export default class ScatterChart extends Component {

    componentDidMount() {
        this._chart = createScatterPlot(this.props);
        this._chart.renderTo(this.refs.svg);
    }
    componentDidUpdate() {
        this._chart && this._chart.destroy();
        this._chart = createScatterPlot(this.props);
        this._chart.renderTo(this.refs.svg);
    }
    componentWillUnmount() {
        this._chart && this._chart.destroy();
    }

    render() {
        const dimensions = this.props.dimensions;
        return (
            <div className="asp-ratio-wrapper">
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

