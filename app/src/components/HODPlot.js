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

import Measure from 'react-measure';
import TimingChart from '../visualizations/TimingChart';
import {getFilteredData, getMetricLabel, getDimensionLabel} from './selectors';

class HODPlot extends Component {
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
    const {data, displayNames} = this.props;
    const chart = <TimingChart data={data} displayNames={displayNames} dimensions={this.state.dimensions} />
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
  const rawData = getFilteredData(state);
  const metric = state.primary;
  const data = sampleSize(rawData, 500)
    .map(d => {
      return {
        x : normalizeDate(d.snippet_publishedAt),
        y : d[metric],
        duration : d.duration_sec * 1000,
      }
    });
  return {data, 
          displayNames : {
            metric : getMetricLabel(state)
          }};
}

export default connect(select)(HODPlot);
