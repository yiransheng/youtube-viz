import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Menu, Dropdown, Button, Icon, message } from 'antd';

export class MetricSelect extends Component {
  render() {
    const {label, metrics, current, onChange, type} = this.props;
    const handleChange = (e) => {
      onChange(type, e.key);
    }
    const menuItems = metrics.filter(m => m !== current).map((m) => {
      return (
        <Menu.Item key={m}>
          <span>{m}</span>
        </Menu.Item>
      );
    });
    const menu = (
      <Menu onClick={handleChange}>
        {menuItems}
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <Button type="ghost" style={{ marginLeft: 8 }}>
          <strong>{label}: </strong> {current} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

class PrimaryMetric extends Component {

  render() {
    const {dispatch, metrics, primary, secondary} = this.props;
    return (
      <div className="divider-bottom">
        <h3>Select Metrics</h3>
        <p>Changing metrics dynamically affects all plots below.</p>
        <br />
        <MetricSelect label="Primary Metric"
          type="SET_PRIMARY_METRIC"
          current={primary}
          metrics={metrics}
          onChange={(type, metric) => dispatch({ type, payload: metric })} />
      </div>
    );
  }
}

const select = (state) => {
  return {
    metrics:state.metrics,
    primary:state.primary || '',
    secondary:state.secondary || '',
  };
}

export default connect(select)(PrimaryMetric);
