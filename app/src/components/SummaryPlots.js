import React from 'react';
import {connect} from 'react-redux'; 
import { Modal, Button, Menu, Dropdown, Icon } from 'antd';


import {find, without, snakeCase, capitalize} from 'lodash';
import {sum, select, range, randomNormal} from 'd3';
import Histogram from '../visualizations/Histogram';
import {getFilteredDataWithoutHists} from './selectors';


function mapStateToProps(state) {
  return {
    data : getFilteredDataWithoutHists(state),
    histPlots : state.histPlots,
    metrics : state.metrics
  };
}

function formatKey(key) {
  const parts = snakeCase(key).split("_");
  return parts.map(capitalize).join(" ");
}

class Plot extends React.Component {
  static defaultProps = {

  }
  constructor(props) {
    super(props);
    this.state = {
      showModal : false
    };
  }

  onBrush = (key, ext) => {
    this.props.dispatch({
      type : 'BRUSH',
      payload : {
        key,
        ext
      }
    });
  }
  addField(key) {
    this.props.dispatch({
      type : 'ADD_HISTOGRAM',
      payload : key
    });
    this.setState({ showModal : false });
  }
  remove(key) {
    this.props.dispatch({
      type : 'REMOVE_HISTOGRAM',
      payload : key
    });
    this.setState({ showModal : false });
  }
  render() {
    const {data, histPlots, metrics} = this.props;
    const keys = Object.keys(histPlots);
    const plots = keys.map(key => {
      const {ext} = histPlots[key];
      const plotData = data.filter(d => {
        const conditions = keys.map(k => {
          if (k === key) {
            return true;
          } else {
            const e = histPlots[k].ext;
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
                title={formatKey(key)}
                onBrush={ext => this.onBrush(key, ext)}
                brushExtent={ext} />
        </div>
      );

    });
    const remainingKeys = without(metrics, ...keys);
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
              <span className="ant-dropdown-link">
                Choose Field <Icon type="down" />
              </span>
            </Dropdown>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Plot);
