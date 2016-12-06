import createRouter from 'router5';
import loggerPlugin from 'router5/plugins/logger';
import listenersPlugin from 'router5/plugins/listeners';
import browserPlugin from 'router5/plugins/browser';
import routes from './routes';

import transitionPath from 'router5.transition-path';

const dataMiddlewareFactory = (routes) => (router, deps) => (toState, fromState) => {
  const { toActivate } = transitionPath(toState, fromState);
  const onActivateHandlers =
    toActivate
      .map(segment => routes.find(r => r.name === segment).onActivate)
      .filter(Boolean)

  const actions = onActivateHandlers
    .map(func => func(toState.params));

  return Promise.all(actions)
    .then(actions => {
       actions.forEach(deps.store.dispatch);
       return {toState};
    })
};

export default function configureRouter(useListenersPlugin = false) {
  const router = createRouter(routes)
    // Plugins
    .usePlugin(loggerPlugin)
    .usePlugin(browserPlugin({
      useHash: true
    }));

  if (useListenersPlugin) {
    router.usePlugin(listenersPlugin());
  }
  router.useMiddleware(dataMiddlewareFactory(routes));

  return router;
}
