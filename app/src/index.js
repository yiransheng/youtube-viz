import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import espromise from 'es6-promise';
import 'isomorphic-fetch';
import createLogger from 'redux-logger';

import 'antd/dist/antd.css';
import 'plottable/plottable.css';
import './index.css';

import reducer from './reducer';
import App from './App';

espromise.polyfill();

const store = createStore(reducer, applyMiddleware(
  createLogger() 
));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(
  app,
  document.getElementById('root')
);

fetch('yt_output_filtered.json')
  .then(data => {
  });

