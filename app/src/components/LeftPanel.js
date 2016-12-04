import React, {Component} from 'react';
import { Button, Input, Table, Icon, Form } from 'antd';
import {get, snakeCase, capitalize, sampleSize} from 'lodash';
import Formula from './Formula';

import {connect} from 'react-redux';

const css = [
  "dark",
  "with-padding",
  "full-height"
].join(" ");

const columns = [
  {
    title : "Metric",
    key : "metric",
    dataIndex : "metric"
  },
  {
    title : "Type",
    key : "type",
    dataIndex : "type"
  },
  // {
  //   title : "Sample",
  //   key : "samples",
  //   dataIndex : "samples"
  // }
]
function formatKey(key) {
  const parts = snakeCase(key).split("_");
  return parts.map(capitalize).join(" ");
}

function select(state) {
  return {
    data : state.data,
    metrics : state.metrics,
    metaData : state.metaData
  };
}

class LeftPanel extends Component {
  render() {
    const {metrics, metaData, data:dataset} = this.props;
    const data = metrics.map((d,i) => {
      return {
        key : i,
        metric: d,
        type: get(metaData[d], "type") || "INT",
        description: get(metaData[d], "description") || `${formatKey(d)} of a video: Integer.`,
        samples : '[' + sampleSize(dataset, 3).map(datum=>datum[d]).join(", ") + ']'
      }
    });
    return (
      <div className={css}>
        <div className="with-padding-y">
          <h2>Metrics</h2>
        </div>
        <div className="light">
          <Table size="small" columns={columns} 
                 dataSource={data} 
                 expandedRowRender={record => <p>{record.description}</p>}
                 />
        </div>
        <div className="with-padding-y">
          <Formula />
        </div>
        <div className="with-padding-y">
          <h2>Dimensions</h2>
        </div>
        <div className="light">
        </div>
      </div>
    );
  }
}
export default connect(select)(LeftPanel);
