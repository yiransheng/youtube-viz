import moment from 'moment';
import data from './yt_output_filter.json';
import presets from './presets.json';
import {sortBy, range, snakeCase, includes, uniq} from 'lodash';
import jsep from 'jsep';

// setup initial state
const now = Date.now();

data.forEach(d => {
  d.hour_of_day = moment(d.snippet_publishedAt).format("HH");
  d.publish_year = moment(d.snippet_publishedAt).format("YYYY");
  d.statistics_age_days = (now - moment(d.snippet_publishedAt).toDate().getTime()) / (24 * 3600000);
  d.snippet_publishedAt = moment(d.snippet_publishedAt).toDate();
  d.number_of_tags = (d.snippet_tags || []).length;
});

const initState = {
  data,
  primary : "statistics_viewCount",
  secondary: "duration_sec",
  primaryDimension: "snippet_channelTitle",
  primaryRadius: "statistics_likeCount",
  filters : {},
  metrics : [
    // "category",
    // "contentDetails_duration",
    // "contentDetails_projection",
    "duration_sec",
    "statistics_age_days",
    "number_of_tags",
    // "id",
    // "snippet_categoryId",
    // "snippet_channelId",
    // "snippet_channelTitle",
    // "snippet_localized_title",
    // "snippet_publishedAt",
    // "snippet_tags",
    // "snippet_thumbnails_default_url",
    // "snippet_title",
    "statistics_commentCount",
    "statistics_dislikeCount",
    "statistics_favoriteCount",
    "statistics_likeCount",
    "statistics_viewCount"
  ],
  dimensions : [
    "category",
    // "id",
    "snippet_channelTitle",
    "hour_of_day",
    "publish_year"
  ],
  metaData : {
    "duration_sec" : {
      type : "INT",
      description: "Duration of a video in seconds."
    },
    "snippet_channelTitle" : {
      type : "Factor",
      label : "Channels"
    },
    "hour_of_day" : {
      type : "Factor",
      label : "Hour of Day",
      description : "Hour of the day for a video's published timestamp.",
      levels : range(24).map(i => {
        i = i.toString();
        return i.length < 2 ? '0' + i : i;
      })
    }
  },
  histPlots : {}
}

initState.dimensions.forEach(dim => {
  if (initState.metaData[dim]) {
    return;
  }
  initState.metaData[dim] = {
    type : "Factor",
    levels : sortBy(uniq(data.map(x=>x[dim])))
  }
});

// reducers

function brushReducer(state, action) {
  let {key, ext} = action.payload;
  if (ext && ext[0] <= -Infinity) {
    ext = null;
  }
  const {histPlots} = state;
  const newPlots = {
    ...histPlots,
    [key] : {
      ...histPlots[key],
      ext
    }
  };
  return {...state, histPlots:newPlots};
}
function addHistogramReducer(state, action) {
  const key = action.payload;
  const histPlots = {
    ...state.histPlots,
    [key] : {
      ext : null
    }
  };
  return {...state, histPlots};
}
function removeHistogramReducer(state, action) {
  const key = action.payload;
  const histPlots = {...state.histPlots};
  delete histPlots[key];
  return {...state, histPlots};
}

function addFormula(state, action) {
  const {name, formula, raw} = action.payload;
  const key = snakeCase(name);
  const {metrics} = state;
  if (includes(metrics, key)) {
    return state;
  }
  state.data.forEach(d => {
    d[key] = evaluate(d, formula);
  });
  const metaData = {
    ...state.metaData,
    [key] : {
      type : 'Formula',
      raw : raw,
      description: `User added Formula: ${raw}`
    }
  }
  return {...state, metaData, metrics: [...metrics, key]};
}
const ops = {
  '+' : (a, b)=>a+b,
  '-' : (a, b)=>a-b,
  '*' : (a, b)=>a*b,
  '/' : (a, b)=>a/b
}
function evaluate(datum, formula) {
  if (formula.type === 'Literal') {
    return formula.value;
  }
  if (formula.type === 'Identifier') {
    return datum[formula.name];
  }
  if (formula.type === 'BinaryExpression') {
    return ops[formula.operator](
      evaluate(datum, formula.left),
      evaluate(datum, formula.right)
    );
  }
  if (formula.type === 'CallExpression') {
    const func = Math[formula.callee.name];
    const args = formula.arguments.map(arg => evaluate(datum, arg));
    const val =  func.apply(Math, args);
    if (val <= -Infinity || val >= Infinity) {
      return NaN;
    }
    return val;
  }
  throw "Evaluation Error";
}

function applyPreset(state, action) {
  const {preset, formulas} = action.payload;
  const newState = {...state, ...preset};
  const finalState = formulas.reduce((state, [k,v]) => {

    return addFormula(state, {
      type : 'ADD_FORMULA',
      payload : {
        name : k,
        raw  : v.raw,
        formula : jsep(v.raw)
      }
    });

  }, newState);

  return finalState;
}

export default function(state=initState, action) {
  switch (action.type) {
    case 'LOAD_PRESET':
      const id = action.payload;
      if (id <= 0) {
        return initState;
      };
      return applyPreset(initState, {
        payload : presets[id-1]
      });
    case 'UPDATE_FILTER':
      const {dimension, values} = action.payload;
      return {
        ...state,
        filters : {
          ...state.filters,
          [dimension] : values
        }
      };
    case 'SET_PRIMARY_METRIC':
      return {
        ...state,
        primary: action.payload
      };
    case 'SET_SECONDARY_METRIC':
      return {
        ...state,
        secondary: action.payload
      };
    case 'SET_PRIMARY_DIMENSION':
      return {
        ...state,
        primaryDimension: action.payload
      };
    case 'LOAD_DATA':
      return {
        ...state,
        data : action.payload
      };
    case 'BRUSH':
      return brushReducer(state, action);
    case 'ADD_HISTOGRAM':
      return addHistogramReducer(state, action);
    case 'REMOVE_HISTOGRAM':
      return removeHistogramReducer(state, action);
    case 'ADD_FORMULA':
      return addFormula(state, action);
    default:
      return state;
  }
}
