import Plottable from 'plottable/plottable'
import React, {Component} from 'react';

function createScatterPlot({data, metric_x_label, metric_y_label, metric_x, metric_y}) {
    var xScale = new Plottable.Scales.Linear();
    var yScale = new Plottable.Scales.Linear();
    var metric_x_label = metric_x_label || "X";
    var metric_y_label = metric_y_label || "Y";

    var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");

    var plot = new Plottable.Plots.Scatter()
        .addDataset(new Plottable.Dataset(data))
        .x(function(d) { return d[metric_x]; }, xScale)
        .y(function(d) { return d[metric_y]; }, yScale);

    const title = `${metric_y_label} versus ${metric_x_label}`;
    const titleLabel = new Plottable.Components.TitleLabel(title);
    const xTitle = metric_x_label;
    var xTitleLabel = new Plottable.Components.AxisLabel(xTitle);
    const yTitle = metric_y_label;
    var yTitleLabel = new Plottable.Components.AxisLabel(yTitle);

    var table = new Plottable.Components.Table([
        [null, null, titleLabel],
        [ yTitleLabel, yAxis, plot],
        [null, null, xAxis],
        [null, null, xTitleLabel]
    ]);

    window.addEventListener("resize", function() {
        plot.redraw();
    });

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

