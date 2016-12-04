import React, {Component} from 'react';
import { Button, Input, Table, Icon } from 'antd';
import {get, snakeCase, capitalize} from 'lodash';

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
  }
]
function formatKey(key) {
  const parts = snakeCase(key).split("_");
  return parts.map(capitalize).join(" ");
}

function select(state) {
  return {
    metrics : state.metrics,
    metaData : state.metaData
  };
}

class LeftPanel extends Component {
  render() {
    const {metrics, metaData} = this.props;
    const data = metrics.map((d,i) => {
      return {
        key : i,
        metric: d,
        type : "Integer",
        description: get(metaData[d], "description") || `${formatKey(d)} of a video: Integer.`
      }
    });
    return (
      <div className={css}>
        <div className="with-padding-y">
          <h2>Metrics</h2>
        </div>
        <div className="light">
          <Table columns={columns} 
                 dataSource={data} 
                 expandedRowRender={record => <p>{record.description}</p>}
                 />
        </div>
        <div className="with-padding-y">
          <Input placeholder="type formula" />
        </div>
        <div className="with-padding-y">
          <Button type="primary">Add Formula</Button>
        </div>
        <div className="with-padding-y">
          <h2>Dimensions</h2>
        </div>
        <div className="light">
          <Table columns={columns} 
                 dataSource={data.slice(0,3)} 
                 expandedRowRender={record => <p>{record.description}</p>}
                 />
        </div>
      </div>
    );
  }
}
export default connect(select)(LeftPanel);
