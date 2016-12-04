import React from 'react';


export default class FixedPanel extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="fixed-panel">
        {children}
      </div>
    );
  }
}
