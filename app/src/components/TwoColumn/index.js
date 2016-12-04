import React, { Component } from 'react';
import FixedPanel from './FixedPanel';
import FluidPanel from './FluidPanel';


const containerStyle = {
  display: 'flex',
  flexWrap : 'no-wrap',
  flexDirection: 'row',
  transition: 'transform 0.5s, width 0.5s',
};

export default class TwoColumnContainer extends Component {
  static defaultProps = {
    headerOffset : 47,
    footerOffset : 0,
    leftWidth : 480,
    hideLeft : false
  }
  render() {
    const children = React.Children.toArray(this.props.children);

    const leftPanel = children[0];
    const rightPanel = children[1];

    return (
      <div className="two-column">
        <FixedPanel>
          {leftPanel}
        </FixedPanel>
        <FluidPanel>{rightPanel}</FluidPanel>
      </div>
    );
  }
}
