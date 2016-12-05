/**
 * Created by Safyre on 12/4/16.
 */
import {
    sortBy,
    sampleSize
} from 'lodash';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getFilteredData} from './selectors';

import ScatterChart from '../visualizations/scatter';

const colorPalette = ["#7AC36A", "#5A9BD4", "#FAA75B", "#9E67AB", "#CE7058", "#D77FB4", "#F15A60", "#737373"];

class ScatterPlot extends Component {
    render() {
        const {data} = this.props;
        return <ScatterChart data={data}
                //metric_x_label={XLabel} metric_y_label={YLabel}
                             metric_x="x"
                             metric_y="y" />;
    }
}

function select(state) {
    const filteredData = getFilteredData(state);
    const XLabel = state.primary;
    const YLabel = state.secondary;

    //sample 500 points
    const subset = sampleSize(filteredData, 500)
    .map(d => {
        return {
             "x": d[state.primary],
             "y": d[state.secondary]
        }
    });

    //Filter Outliers
    

    return {data: subset,
        //XLabel, //doesn't work even when declared in Class above?
        //YLabel
    };
}

export default connect(select)(ScatterPlot);
