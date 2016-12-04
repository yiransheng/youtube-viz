import React, {Component} from 'react';
import { Button, Input, Table, Icon } from 'antd';

const css = [
  "dark",
  "with-padding",
  "full-height"
].join(" ");

const metrics = [
  "likeCount",
  "Comment Count",
  "Fav Count",
  "Dislike Count",
  "View Count",
  "Duration"
]

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
const data = metrics.map((d,i) => {
  return {
    key : i,
    metric: d,
    type : "Integer",
    description: d
  }
});

export default class LeftPanel extends Component {
  render() {
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
