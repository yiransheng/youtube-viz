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
import {getFilteredData} from './selectors';

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
    const filteredData = getFilteredData(state);
    const metric = state.primary;
    const groupKey = state.primaryDimension;

    return {data: filteredData, dimensionKey: groupKey, metricLabel:metric};
}

export default connect(select)(ChannelPlot);
