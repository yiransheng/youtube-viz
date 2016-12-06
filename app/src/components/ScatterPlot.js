/**
 * Created by Safyre on 12/4/16.
 */
import {
    sortBy,
    sampleSize
} from 'lodash';
import {
  getMetricLabel,
  getMetricLabelSecondary
} from './selectors';
import max from "d3";

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getFilteredData} from './selectors';

import Measure from 'react-measure';
import ScatterChart from '../visualizations/scatter';

const colorPalette = ["#7AC36A", "#5A9BD4", "#FAA75B", "#9E67AB", "#CE7058", "#D77FB4", "#F15A60", "#737373"];

class ScatterPlot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                width: 10,
                height: 10
            }
        };
    }
    render() {
        const {
            data,
            metric_x_label,
            metric_y_label
        } = this.props;
        const chart = <ScatterChart data={data}
                             dimensions={this.state.dimensions}
                             metric_x_label={metric_x_label}
                             metric_y_label={metric_y_label}
                             metric_x="x"
                             metric_y="y" />;
        return (
            <Measure 
              onMeasure={(dimensions) => {
                this.setState({dimensions})
              }}>
              {chart}
            </Measure>
        );
    }
}

function select(state) {
    const filteredData = getFilteredData(state);
    const XLabel = getMetricLabel(state);
    const YLabel = getMetricLabelSecondary(state);

    //sample 500 points
    const subset = sampleSize(filteredData, 500)
    .map(d => {
        return {
             "y": d[state.primary],
             "x": d[state.secondary],
             "radius": Math.log(d[state.primaryRadius] +1)
        }
    });

    //Filter Outliers


    return {data: subset,
        metric_x_label: YLabel,
        metric_y_label: XLabel,
    };
}

export default connect(select)(ScatterPlot);
