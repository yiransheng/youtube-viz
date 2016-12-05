import {
    isNumber,
    toPairs,
    groupBy
} from 'lodash';
import {
    sum,
} from 'd3';
import React, {Component} from 'react';
import Measure from 'react-measure';
import {connect} from 'react-redux';
import {getFilteredData, getMetricLabel, getDimensionLabel} from './selectors';

import HorizBarChart from '../visualizations/bar';

class ChannelPlot extends Component {
    constructor(props) {
      super(props);
      this.state = {
        dimensions: {
          width: 10,
          height: 10
        }
      }
    }
    render() {
        const {data, metricLabel, dimensionKey, displayNames} = this.props;
        const chart = <HorizBarChart data={data}
                         metricLabel={metricLabel}
                         displayNames={displayNames}
                         dimensions={this.state.dimensions}
                         dimensionKey={dimensionKey} />;
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
    const metric = state.primary;
    const groupKey = state.primaryDimension;

    return {
      data: filteredData, 
      dimensionKey: groupKey, 
      metricLabel:metric,
      displayNames : {
        dimension : getDimensionLabel(state),
        metric : getMetricLabel(state)
      }
    };
}

export default connect(select)(ChannelPlot);
