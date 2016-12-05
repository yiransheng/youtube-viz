import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router5';
import {Provider} from 'react-redux';

import 'antd/dist/antd.css';
import 'plottable/plottable.css';
import './index.css';

import {router, store} from './store';

import App from './App';

const app = (
  <Provider store={store}>
    <RouterProvider router={ router }>
      <App />
    </RouterProvider>
  </Provider>
)

router.start((err, state) => {
  ReactDOM.render(
    app,
    document.getElementById('root')
  );
});
