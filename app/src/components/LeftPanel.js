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
const columnsDims = [
  {
    title : "Dimension",
    key : "dimension",
    dataIndex : "dimension"
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
    data : state.data,
    metrics : state.metrics,
    dimensions : state.dimensions,
    metaData : state.metaData
  };
}

class LeftPanel extends Component {
  render() {
    const {metrics, dimensions, metaData, data:dataset} = this.props;
    const data = metrics.map((d,i) => {
      return {
        key : i,
        metric: d,
        type: get(metaData[d], "type") || "INT",
        description: get(metaData[d], "description") || `${formatKey(d)} of a video: Integer.`,
        samples : '[' + sampleSize(dataset, 3).map(datum=>datum[d]).join(", ") + ']'
      }
    });
    const dataDims = dimensions.map((d,i) => {
      return {
        key : i,
        dimension: d,
        type: get(metaData[d], "type") || "Factor",
        description: get(metaData[d], "description") || `${formatKey(d)} of a video.`,
        samples : '[' + sampleSize(dataset, 3).map(datum=>datum[d]).join(", ") + ']'
      }
    });
    const addFormula = (added) => {
      this.props.dispatch({
        type : 'ADD_FORMULA',
        payload : added
      });
    };
    return (
      <div className={css}>
        <div className="with-padding-y">
          <h2>Metrics</h2>
        </div>
        <div className="light">
          <Table size="small" columns={columns} 
                 dataSource={data} 
                 expandedRowRender={record => <div><p>{record.description}</p><p>{'Samples: ' + record.samples}</p></div>}
                 />
        </div>
        <div className="with-padding-y">
          <h3>Add Additional Metrics</h3>
          <p>You can type in a math expression to compute new metrics from existing ones.</p>
          <br />
          <Formula onAdd={addFormula} />
        </div>
        <div className="with-padding-y">
          <h2>Dimensions</h2>
        </div>
        <div className="light">
          <Table size="small" columns={columnsDims} 
                 dataSource={dataDims} 
                 expandedRowRender={record => <div><p>{record.description}</p><p>{'Samples: ' + record.samples}</p></div>}
                 />
        </div>
      </div>
    );
  }
}
export default connect(select)(LeftPanel);
