import {
  isNumber,
  toPairs,
  groupBy,
  sampleSize
} from 'lodash';
import {
  sum,
  median
} from 'd3';
import moment from 'moment';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import TimingChart from '../visualizations/TimingChart';

class HODPlot extends Component {
  render() {
    const {data} = this.props;
    return <TimingChart data={data}
             />
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

const today = moment().startOf("day").toDate().getTime();

function normalizeDate(date) {
  const timestamp = date.getTime();
  date = moment(date);
  const start = date.startOf("day").toDate().getTime(); 
  return new Date(today + timestamp - start);
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
  const data = sampleSize(rawData, 500)
    .map(d => {
      return {
        x : normalizeDate(d.snippet_publishedAt),
        y : d[metric],
        duration : d.duration_sec * 1000
      }
    });
  return {data};
}

export default connect(select)(HODPlot);
