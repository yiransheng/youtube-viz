import {
    isNumber,
    toPairs,
    groupBy
} from 'lodash';
import {
    sum,
} from 'd3';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import HorizBarChart from '../visualizations/bar';

class ChannelPlot extends Component {
    render() {
        const {data, metricLabel, dimensionKey} = this.props;
        return <HorizBarChart data={data}
                         metricLabel={metricLabel}
                         dimensionKey={dimensionKey} />;
    }
}

function select(state) {
    const keys = Object.keys(state.histPlots);
    const filteredData = state.data.filter(d => {
        const conditions = keys.map(k => {
            const e = state.histPlots[k].ext;
            return e ? (d[k] >= e[0] && d[k] <= e[1]) : true;
        });
        return sum(conditions) === keys.length;
    });
    const metric = state.primary;
    const groupKey = state.primaryDimension;

    return {data: filteredData, dimensionKey: groupKey, metricLabel:metric};
}

export default connect(select)(ChannelPlot);
