import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import 'antd/dist/antd.css';
import 'plottable/plottable.css';
import './index.css';

import reducer from './reducer';
import App from './App';

const store = createStore(reducer);

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(
  app,
  document.getElementById('root')
);

