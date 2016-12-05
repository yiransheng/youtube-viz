import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Menu, Dropdown, Button, Icon, message } from 'antd';

class PrimaryMetric extends Component {

  render() {
    const {dispatch, metrics, primary, secondary} = this.props;

    function handleMenuClick1(e) {
      dispatch({
        type : 'SET_PRIMARY_METRIC',
        payload : e.key
      });
    }
    function handleMenuClick2(e) {
      dispatch({
        type : 'SET_SECONDARY_METRIC',
        payload : e.key
      });
    }

    const menuItems1 = metrics.filter(m => m !== primary).map((m) => {
      return (
        <Menu.Item key={m}>
          <span>{m}</span>
        </Menu.Item>
      );
    });
    const menuItems2 = metrics.filter(m => m !== secondary).map((m) => {
      return (
        <Menu.Item key={m}>
          <span>{m}</span>
        </Menu.Item>
      );
    });
    const menu1 = (
      <Menu onClick={handleMenuClick1}>
        {menuItems1}
      </Menu>
    );
    const menu2 = (
      <Menu onClick={handleMenuClick2}>
        {menuItems2}
      </Menu>
    );
    return (
      <div className="divider-bottom">
        <Dropdown overlay={menu1}>
          <Button type="ghost" style={{ marginLeft: 8 }}>
            <strong>Primary Metric: </strong> {primary} <Icon type="down" />
          </Button>
        </Dropdown>
        <Dropdown overlay={menu2}>
          <Button type="ghost" style={{ marginLeft: 8 }}>
            <strong>Secondary Metric: </strong> {secondary} <Icon type="down" />
          </Button>
        </Dropdown>
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
