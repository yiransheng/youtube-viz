import React from 'react';

export default class FluidPanel extends React.Component {
  render() {
    return (
      <div className="fluid-panel">
        {this.props.children}
      </div>
    );
  }
}
