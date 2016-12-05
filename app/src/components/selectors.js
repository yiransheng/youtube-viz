import {
  isNumber,
  toPairs,
  get,
  includes,
  groupBy,
  snakeCase,
  capitalize,
  cloneDeep
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

function formatKey(key) {
  const parts = snakeCase(key).split("_");
  return parts
    .filter(p => p !== 'statistics' && p !== 'snippet')
    .map(capitalize)
    .join(" ");
}
const getMetricLabel = (state) => {
  const key = state.primary;
  if (!key) {
    return '<Choose Metric>';
  };
  const label = get(state.metaData[key], 'label'); 
  return label || formatKey(key);
}
const getMetricLabelSecondary = (state) => {
  const key = state.secondary;
  if (!key) {
    return '<Choose Metric>';
  };
  const label = get(state.metaData[key], 'label'); 
  return label || formatKey(key);
}
const getDimensionLabel = (state) => {
  const key = state.primaryDimension;
  if (!key) {
    return '<Choose Dimension>';
  };
  const label = get(state.metaData[key], 'label'); 
  return label || formatKey(key);
}

function getPreset(state) {
  const {data, metaData, metrics, dimensions, router, ...rest} = state;
  const preset = cloneDeep(rest);
  const formulas = Object.keys(state.metaData)
    .map(k => {
      return [k, state.metaData[k]];
    })
    .filter(([k, v]) => v.type === 'Formula')
  return {preset, formulas};
}

export {
  getMetricLabel,
  getMetricLabelSecondary,
  getDimensionLabel,
  getFilteredData,
  getFilteredDataWithoutHists,
  getPreset
}
