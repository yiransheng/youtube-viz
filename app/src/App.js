import React from 'react';
import {connect} from 'react-redux';
import {actions} from 'redux-router5';

import { Row, Col } from 'antd';

import Home from './components/Home';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import TwoColumn from './components/TwoColumn'; 
import PrimaryMetric from './components/PrimaryMetric';
import Filter from './components/Filter';
import SummaryPlots from './components/SummaryPlots';
import MainPlot from './components/MainPlot';
import HODPlot from './components/HODPlot';
import ChannelPlot from './components/PerChannel';
import ScatterPlot from './components/ScatterPlot';

class Report extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <TwoColumn>
          <LeftPanel />
          <div className="with-padding" style={{ paddingTop: '2em' }}>
            <Filter />
            <SummaryPlots />
            <PrimaryMetric />
            <Row gutter={16}>
              <Col span={24}>
                <MainPlot />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <ChannelPlot />
              </Col>
              <Col span={12}>
                <HODPlot />
              </Col>
            </Row>
            <Row gutter={16}>
              <ScatterPlot />
            </Row>
          </div>
        </TwoColumn>
      </div>
    );
  }
}

class App extends React.Component {

  render() {
    const {dispatch, route} = this.props;
    const go = (name, params) => {
      dispatch(actions.navigateTo(name, params));
    }
    if (route.name === 'report' || route.name === 'report.preset') {
      return <Report />;
    } else {
      return <Home onClick={go}/>;
    }
  }
}

export default connect(state => state.router)(App);
