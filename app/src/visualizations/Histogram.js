import {isEqual} from 'lodash';
import {select} from 'd3';
import React, {Component} from 'react';

import {continuous} from './d3.histogram';

export default class Histogram extends Component {

  static defaultProps = {
    brushExtent : null,
    width: 250,
    height: 250,
    title : "Histogram"
  }

  shoudComponentUpdate(nextProps) {
    const {brushExtent:b1, ...rest1} = this.props;
    const {brushExtent:b2, ...rest2} = nextProps;
    return !isEqual(b1, b2) || !isEqual(rest1, rest2);
  }

  componentDidMount() {
    const svg = this.refs.svg;
    const {data, width, height, title, value, onBrush, brushExtent} = this.props;
    const hist = continuous();

    this._hist = hist;

    hist
      .width(width)
      .height(height)
      .title(title)
      .value(value);

    if (brushExtent) {
      hist.brush(brushExtent);
    }
    if (onBrush) {
      hist.onBrush(onBrush);
    }
    select(svg)
      .call(hist.mount(data));
  }
  componentDidUpdate() {
    const hist = this._hist;
    const {data, width, height, title, value, brushExtent} = this.props;
    hist.width(width)
    hist.height(height)
    hist.title(title)
    hist.value(value)
    hist.brush(brushExtent);
    hist.update(data);
  }
  componentWillUnmount() {
    this._hist.unmount();
  }

  render() {
    return (
        <svg width={this.props.width}
                height={this.props.height}
                ref="svg" />
    );
  }

}
