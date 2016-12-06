/**
 * Created by Safyre on 12/4/16.
 */
import {
    sortBy,
    sampleSize
} from 'lodash';
import {
  getMetricLabel,
  getMetricLabelSecondary,
  getMetricLabelTertiary
} from './selectors';
import max from "d3";

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getFilteredData} from './selectors';

import Measure from 'react-measure';
import ScatterChart from '../visualizations/scatter';
import {MetricSelect} from './PrimaryMetric';

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
            dispatch,
            data,
            metrics,
            metricOptions,
            metric_x_label,
            metric_y_label,
            metric_size_label
        } = this.props;
        const chart = <ScatterChart data={data}
                             dimensions={this.state.dimensions}
                             metric_x_label={metric_x_label}
                             metric_y_label={metric_y_label}
                             metric_size_label={metric_size_label}
                             metric_x="x"
                             metric_y="y" />;
        const onChangeMetric = (type, metric) => {
          dispatch({ type, payload:metric });
        }
        return (
            <div>
              <div style={{margin: '1em 0', paddingLeft: '1em' }}>
                <strong>Metrics: </strong>
                {metricOptions.map(props => <MetricSelect {...props} metrics={metrics} onChange={onChangeMetric} />)}
              </div>
              <Measure 
                onMeasure={(dimensions) => {
                  this.setState({dimensions})
                }}>
                {chart}
              </Measure>
            </div>
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
             "radius": d[state.primaryRadius]
        }
    });

    //Filter Outliers


    return {data: subset,
        metrics : state.metrics,
        metricOptions : [
          {type: 'SET_PRIMARY_METRIC', label: 'Primary Metric (Y Axis)', current:state.primary},
          {type: 'SET_SECONDARY_METRIC', label: 'X Axis', current:state.secondary},
          {type: 'SET_RADIUS_METRIC', label: 'Size', current:state.primaryRadius}
        ],
        metric_x_label: YLabel,
        metric_y_label: XLabel,
        metric_size_label: getMetricLabelTertiary(state)
    };
}

export default connect(select)(ScatterPlot);
