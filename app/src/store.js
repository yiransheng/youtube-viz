import createRouter from './create-router';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { router5Middleware, router5Reducer } from 'redux-router5';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';

import reducer from './reducer';

function configureStore(router, initialState) {
  const createStoreWithMiddleware = applyMiddleware(
    createLogger(), 
    router5Middleware(router)
  )(createStore);

  const emptyRouter = router5Reducer(undefined, {});

  const rootReducer=(state, action) => {
    const newState = reducer(state, action);
    if (!newState.router) {
      Object.assign(newState, {router:emptyRouter});
    }
    const newRouter = router5Reducer(newState.router, action);
    if (newRouter !== newState.router) {
      return {...newState, router:newRouter};
    } else {
      return newState;
    }
  }

  const store = createStoreWithMiddleware(rootReducer);

  return store;
}

const router = createRouter();
const store = configureStore(router);

router.setDependency('store', store);

export {
  router,
  store
};

