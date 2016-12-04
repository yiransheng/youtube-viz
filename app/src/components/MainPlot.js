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
    const {dataMonthly, dataDaily, metricLabel} = this.props; 
    return <BarChart data={dataMonthly} 
            metricLabel={metricLabel}
            dataRefined={dataDaily} dimensionKey="x" metricKey="y" />;
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
  const metric = 'statistics_viewCount';
  const groupKey = 'snippet_publishedAt';
  const aggregationType = 'MEDIAN';

  const dataMonthly = toPairs(
    groupBy(rawData, 
      d => moment(d.snippet_publishedAt).format("YYYY-MM"))
  ).map(([key, values]) => {

    const vals = values.map(d => {
      return Number(d[metric]);
    });

    return {
      x : moment(key+'-01').toDate(),
      y : aggregations[aggregationType](vals)
    }

  });
  const dataDaily = toPairs(
    groupBy(rawData, 
      d => moment(d.snippet_publishedAt).format("YYYY-MM-DD"))
  ).map(([key, values]) => {

    const vals = values.map(d => {
      return Number(d[metric]);
    });

    return {
      x : moment(key).toDate(),
      y : aggregations[aggregationType](vals)
    }

  });

  return {dataMonthly, dataDaily, metricLabel:metric};
}

export default connect(select)(MainPlot);
