import React from 'react';

import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import TwoColumn from './components/TwoColumn'; 
import PrimaryMetric from './components/PrimaryMetric';
import SummaryPlots from './SummaryPlots';
import MainPlot from './components/MainPlot';
import HODPlot from './components/HODPlot';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <TwoColumn>
          <LeftPanel />
          <div className="with-padding">
            <SummaryPlots />
            <PrimaryMetric />
            <MainPlot />
            <HODPlot />
          </div>
        </TwoColumn>
      </div>
    );
  }
}
