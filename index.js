import { constant } from 'lodash';

export default function (restoreStorePromise) {
  return (createStore) => (reducer, preloadedState, enhancers) => {
    if (typeof restoreStorePromise === 'undefined') {
      return createStore(reducer, preloadedState, enhancers);
    }

    const state = {};
    const fakeReducer = constant(state);
    const store = createStore(fakeReducer, state, enhancers);

    let resolved = false;
    const actionsQueue = [];

    const dispatch = (...action) => {
      if (!resolved) {
        actionsQueue.push(action);
        return;
      }

      store.dispatch(action);
    };
    
    restoreStorePromise
      .then(restoredState => {
        Object.assign(state, restoredState);
      })
      .catch(() => {
        Object.assign(state, preloadedState);
      })
      .then(() => {
        resolved = true;
        store.replaceReducer(reducer);

        actionsQueue.forEach(action => {
          store.dispatch(...action);
        });
      })

    return {
      ...store,
      dispatch,
    };
  };
}
