import {
  isNumber,
  toPairs,
  includes,
  groupBy
} from 'lodash';
import {
  sum,
  median
} from 'd3';
import moment from 'moment';
import { createSelector } from 'reselect'

const selectData = state => state.data;
const selectHistPlots = state => state.histPlots;
const selectFilters = state => state.filters;

const getFilteredDataWithoutHists = createSelector(
  selectData,
  selectFilters,
  (data, filters) => {
    const filterKeys = Object.keys(filters);
    const data2 = data.filter(d => {
      const conditions = filterKeys.map(k => {
        const vals = filters[k];
        if (vals && vals.length) {
          return includes(vals, d[k]);
        } else {
          return true;
        }
      });
      return sum(conditions) === filterKeys.length;
    });
    return data2;
  }
)

const getFilteredData = createSelector(
  getFilteredDataWithoutHists,
  selectHistPlots,
  (data, histPlots) => {
    const keys = Object.keys(histPlots);
    const data1 = data.filter(d => {
      const conditions = keys.map(k => {
        const e = histPlots[k].ext;
        return e ? (d[k] >= e[0] && d[k] <= e[1]) : true;
      });
      return sum(conditions) === keys.length;
    });
    return data1;
  }
);

export {
  getFilteredData,
  getFilteredDataWithoutHists
}
