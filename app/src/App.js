import React from 'react';

import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import TwoColumn from './components/TwoColumn'; 
import PrimaryMetric from './components/PrimaryMetric';
import Filter from './components/Filter';
import SummaryPlots from './components/SummaryPlots';
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
            <Filter />
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
