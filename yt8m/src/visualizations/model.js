import {
  fromPairs
} from 'lodash';
import {
  color,
  histogram
} from 'd3';

/*
 jq 'keys' yt8m_sample_stats.json 
[
  "dominant_color",
  "id",
  "statistics.commentCount",
  "statistics.dislikeCount",
  "statistics.favoriteCount",
  "statistics.likeCount",
  "statistics.viewCount"
]
*/ 

function normalizeKey(jsonKey) {
  return jsonKey.replace("statistics.", "");
}

const props = [
  "dominant_color",
  "id",
  "statistics.commentCount",
  "statistics.dislikeCount",
  "statistics.favoriteCount",
  "statistics.likeCount",
  "statistics.viewCount"
];

export function parse(json) {

  let data = Object.keys(json.id)
    .map(index => {
      const keyValue = props.map(p => {
        const key = normalizeKey(p);
        let value = json[p][index];
        if (p === 'dominant_color') {
          value = color(value);
        }
        return [key, value];
      });

      return fromPairs(keyValue);
    });

  data = data.filter(d => {
    return d.likeCount < 3500 && d.dislikeCount < 400; 
  });

  const index = {};
  for (const [i, d] of data.entries()) {
    index[d.id] = i; 
  }
  data.__index = index;

  return data;
}

const channelMapping = {
  'r' : 'r',
  'red' : 'r',
  'g' : 'g',
  'green' : 'g',
  'b' :  'b',
  'blue' : 'b'
}

const hist = histogram().domain([0, 255]).thresholds(20);
export function summarizeColor(data, channel="r") {
  
  channel = channelMapping[channel];

  const values = data.map(d => {
    if (!channel) {
      // use average of rgb;
      const c = d.dominant_color;
      return (c.r + c.g + c.b) / 3.0;
    }
    return d.dominant_color[channel]; 
  });

  return hist(values);
}

