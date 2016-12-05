import 'd3';
import {sortBy} from 'lodash';
import Plottable from 'plottable/plottable';
import React, {Component} from 'react';


function createHorizBarChart(data, metricLabel, dimensionKey, limit) {
    dimesionKey = dimensionKey || 'snippet_channelTitle';
    limit = limit || 5; // default limit is 5

    const plot = new Plottable.Plots.Bar("horizontal");

    //videos per channel
    // a bit tricky because not based on a metric label
    // should use logic, if metric = 'Count' ...
    const countPerChannel = d3.nest()
        .key(function (d) {
            return d[dimensionKey];
        })
        .rollup(function (v) {
            return v.length;
        })
        .entries(data.slice(0, limit));

    const sumPerChannel = d3.nest()
        .key(function (d) {
            return d[dimensionKey];
        })
        .rollup(function (v) {
            return d3.sum(v, function (d) {
                return d[metricLabel]
            });
        })
        .entries(data.slice(0, limit));

    const data1 = new Plottable.Dataset(countPerChannel);
    const data2 = new Plottable.Dataset(sumPerChannel);

    plot.addDataset(data1);
    plot
        .x(d => d[metricLabel], x)
        .y(d => d[dimensionKey], y)
        .attr("fill", "steelblue");

    // ideally would want to display text values on mouse-over
    var interaction = new Plottable.Interactions.Pointer();
    interaction.onPointerMove(function (b) {
        plot.entities().forEach(function (entity) {
            entity.selection.attr("fill", "#5279C7");
        });
        var entity = plot.entityNearest(b);
        entity.selection.attr("fill", "red");
    });

    const title = `Top' ${limit} 'channels by' ${metriclLabel}`;
    const titleLable = new Plottable.Components.TitleLabel(title);

    var xScale = new Plottable.Scales.Linear();
    var yScale = new Plottable.Scales.Category();

    var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");

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
