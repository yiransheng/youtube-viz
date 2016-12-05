import React, {Component} from 'react';
import {connect} from 'react-redux';
// import { Menu, Dropdown, Button, Icon, message } from 'antd';
import { Select } from 'antd';
const Option = Select.Option;

class Filter extends Component {
  render() {
    const {items, values, onChange} = this.props;

    function handleChange(value) {
      console.log(`selected ${value}`);
    }

    const children = items.map(item => {
      return <Option key={item}>{item}</Option>
    });

    return (
      <Select
        multiple
        style={{ minWidth: 240 }}
        placeholder="Filter"
        onChange={handleChange}
      >
        {children}
      </Select>
    );
  }
}

const select = (state) => {

  // const dims = ["category", "snippet_channelTitle"];
  const dims = ["category"];

  return {
    dimensions : dims.map(d => {
      return {
        dimension : d,
        items : state.metaData[d].levels
      }
    })
  };
};

class Filters extends Component {
  render() {
    const {dimensions} = this.props;
    console.log(dimensions);
    const filters = dimensions.map(d => {
      return <Filter items={d.items} key={d.dimension}/>
    });
    return (
      <div>
        {filters}
      </div>
    )
  }
}

export default connect(select)(Filters);
