import React, {Component} from 'react';
import {connect} from 'react-redux';
// import { Menu, Dropdown, Button, Icon, message } from 'antd';
import { Select } from 'antd';
const Option = Select.Option;

import DateRange from './DateRange';

class Filter extends Component {
  static defaultProps = {
    onChange : () => null
  }
  render() {
    const {items, values, onChange} = this.props;

    const children = items.map(item => {
      return <Option key={item}>{item}</Option>
    });

    return (
      <Select
        multiple
        style={{ minWidth: 240 }}
        placeholder=""
        defaultValue={values || []}
        onChange={onChange}
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
    filters : state.filters,
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
    const {dispatch, dimensions, filters} = this.props;
    function handleFilterChange(dim, values) {
      dispatch({
        type : 'UPDATE_FILTER',
        payload : {
          dimension : dim,
          values : values
        }
      });
    }
    const filtersElements = dimensions.map(d => {
      return (
        <div key={d.dimension} className="filter-inline">
          <strong style={{ marginRight: '1em' }}>Filter by video {d.dimension}: </strong>
          <Filter items={d.items} 
                  onChange = {vals => handleFilterChange(d.dimension, vals)}
                  values={filters[d.dimension] || []}/>
        </div>
      );
    });
    return (
      <div className="bottom-spacing">
        <h2>Top Level Filter</h2>
        <br />
        {filtersElements}
        <div className="filter-inline">
          <DateRange range={filters.dates  || null}
            onChange={r => handleFilterChange("dates", r)} />
        </div>
      </div>
    )
  }
}

export default connect(select)(Filters);
