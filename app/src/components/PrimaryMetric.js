import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Menu, Dropdown, Button, Icon, message } from 'antd';

class PrimaryMetric extends Component {

  render() {
    const {dispatch, metrics, primary} = this.props;

    function handleMenuClick(e) {
      dispatch({
        type : 'SET_PRIMARY_METRIC',
        payload : e.key
      });
    }

    const menuItems = metrics.filter(m => m !== primary).map((m) => {
      return (
        <Menu.Item key={m}>
          <span>{m}</span>
        </Menu.Item>
      );
    });
    const menu = (
      <Menu onClick={handleMenuClick}>
        {menuItems}
      </Menu>
    );
    return (
      <div className="divider-bottom">
        <Dropdown overlay={menu}>
          <Button type="ghost" style={{ marginLeft: 8 }}>
            <strong>Primary Metric: </strong> {primary} <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );
  }
}

const select = (state) => {
  return {
    metrics:state.metrics,
    primary:state.primary
  };
}

export default connect(select)(PrimaryMetric);
