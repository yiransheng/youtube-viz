import React, {Component} from 'react';
import logo from './Youtube_icon.svg';

export default class Header extends Component {

  static defaultProps = {
    title : 'Data Visualization'
  }

  render() {
    return (
      <div className="main-header">
        <img src={logo} />
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}
