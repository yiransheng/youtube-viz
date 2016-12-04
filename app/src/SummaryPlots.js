import React from 'react';
import { Modal, Button, Menu, Dropdown, Icon } from 'antd';


import {find, without} from 'lodash';
import {sum, select, range, randomNormal} from 'd3';
import Histogram from './visualizations/Histogram';
import {parse, removeDotsInKey} from './model';

import rawData from './yt_20.json';

const data = removeDotsInKey(rawData);

console.log(data);

const measures = [
  "likeCount",
  "commentCount",
  "dislikeCount",
  "favoriteCount",
  "viewCount"
]

console.log(data);

const initState = {
  data,
  histPlots : [
  ]
}

const reducer = (state=initState, action) => {
  if (action.type === 'BRUSH') {
    let {key, ext} = action.payload;
    if (ext && ext[0] <= -Infinity) {
      ext = null;
    }
    const {histPlots} = state;
    const newPlots = histPlots.map(p => {
      return p.key === key ? {...p, ext} : p;
    });
    return {...state, histPlots:newPlots};
  } else if (action.type === 'ADD_HISTOGRAM') {
    const key = action.payload;
    const histPlots = [...state.histPlots, {
      key,
      ext : null
    }];
    return {...state, histPlots, showModal:false};
  } else if (action.type === 'REMOVE_HISTOGRAM') {
    const key = action.payload;
    const histPlots = state.histPlots.filter(p => p.key !== key);
    return {...state, histPlots, showModal:false};
  }
  return state;
}


class Plot extends React.Component {
  constructor() {
    super();
    this.state = initState;
  }
  onBrush = (key, ext) => {
    this.setState(reducer(this.state, {
      type : 'BRUSH',
      payload : {
        key,
        ext
      }
    }));
  }
  addField(key) {
    this.setState(reducer(this.state, {
      type : 'ADD_HISTOGRAM',
      payload : key
    }));
  }
  remove(key) {
    this.setState(reducer(this.state, {
      type : 'REMOVE_HISTOGRAM',
      payload : key
    }));
  }
  render() {
    const {data, histPlots} = this.state;
    const keys = histPlots.map(p => p.key);
    const plots = histPlots.map(({ key, ext }) => {

      const plotData = data.filter(d => {
        const conditions = keys.map(k => {
          if (k === key) {
            return true;
          } else {
            const e = find(histPlots, {key:k}).ext;
            return e ? (d[k] >= e[0] && d[k] <= e[1]) : true;
          }
        });
        return sum(conditions) === keys.length;
      });

      return (
        <div style={{ position:'relative' }} key={key}>
          <div className="close-button" onClick={() => this.remove(key)}>
            <Icon type="close" />
          </div>
          <Histogram data={plotData}
                value={d => d[key]}
                title={`Plot ${key}`}
                onBrush={ext => this.onBrush(key, ext)}
                brushExtent={ext} />
        </div>
      );

    });
    const remainingKeys = without(measures, ...keys);
    const items = remainingKeys.map((k) => {
      return (
        <Menu.Item key={k}>
          <a onClick={() => this.addField(k)}>{`Field: ${k}`}</a>
        </Menu.Item>
      );
    });
    return (
      <div className="divider-bottom">
        <h2>Metric Summary</h2>
        <div className="hists">
          {plots}
          <div className="add-hist" onClick={() => this.setState({ showModal:true })}>
            Add Plot +
          </div>
          <Modal visible={this.state.showModal}
            title="Add Summary"
            okText="OK"
            cancelText="Cancel"
            onCancel={() => this.setState({showModal:false})}
            onOk={() => this.setState({showModal:false})}>
            <Dropdown overlay={<Menu>{items}</Menu>}>
              <a className="ant-dropdown-link" href="#">
                Choose Field <Icon type="down" />
              </a>
            </Dropdown>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Plot;
