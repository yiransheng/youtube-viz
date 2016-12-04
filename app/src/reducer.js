import rawData from './yt_20.json';
import {parse, removeDotsInKey} from './model';

const data = removeDotsInKey(rawData);

const initState = {
  data,
  metrics : [
    "commentCount",
    "dislikeCount",
    "favoriteCount",
    "likeCount",
    "viewCount",
    "duration_sec"
  ],
  histPlots : {}
}

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

export default function(state=initState, action) {
  switch (action.type) {
    case 'BRUSH':
      return brushReducer(state, action);
    case 'ADD_HISTOGRAM':
      return addHistogramReducer(state, action);
    case 'REMOVE_HISTOGRAM':
      return removeHistogramReducer(state, action);
    default:
      return state;
  }
}
