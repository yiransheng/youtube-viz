import {
  isNumber,
  toPairs,
  groupBy
} from 'lodash';
import {
  sum,
  median
} from 'd3';
import moment from 'moment';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import BarChart from '../visualizations/BarChart';

class MainPlot extends Component {
  render() {
    const {data} = this.props; 
    return <BarChart data={data} dimensionKey="x" metricKey="y" />;
  }
}

const aggregations = {
  AVG (numbers) {
    numbers = numbers.filter(n => {
      return isNumber(n) && !isNaN(n);
    });
    return sum(numbers) / numbers.length; 
  },
  MEDIAN (numbers) {
    numbers = numbers.filter(n => {
      return isNumber(n) && !isNaN(n);
    });
    return median(numbers)
  }
}

function select(state) {
  const keys = Object.keys(state.histPlots);
  const rawData = state.data.filter(d => {
    const conditions = keys.map(k => {
      const e = state.histPlots[k].ext;
      return e ? (d[k] >= e[0] && d[k] <= e[1]) : true;
    });
    return sum(conditions) === keys.length;
  });
  const metric = 'duration_sec';
  const groupKey = 'publishedAt';
  const aggregationType = 'MEDIAN';

  const data = toPairs(
    groupBy(rawData, 
      d => moment(d.publishedAt).format("MMM Do YY"))
  ).map(([key, values]) => {

    const vals = values.map(d => {
      return Number(d[metric]);
    });

    return {
      x : key,
      y : aggregations[aggregationType](vals)
    }

  });

  return {data};
}

export default connect(select)(MainPlot);
