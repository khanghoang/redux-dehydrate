import { expect } from 'chai';
import { createStore, compose } from 'redux';
import { constant, identity } from 'lodash';
import restoreReduxStore from './index';

describe('Restore Redux Store enhancer', () => {
  it('should return function', () => {
    expect(restoreReduxStore()).to.be.a('function');
  });

  it('should return Store', () => {
    const store = restoreReduxStore()(createStore)(constant({}), {});
    const { dispatch, subscribe, getState, replaceReducer } = store;

    /* eslint-disable */
    expect(dispatch).to.be.not.undefined;
    expect(subscribe).to.be.not.undefined;
    expect(getState).to.be.not.undefined;
    expect(replaceReducer).to.be.not.undefined;
    /* eslint-enable */
  });

  it('the store will have initial state from promise', (done) => {
    const restorePromise = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve({ foo: 'bar' });
      }, 0);
    });

    const store = createStore(identity, { foo: '' }, compose(restoreReduxStore(restorePromise())));

    store.subscribe(() => {
      const currentState = store.getState();
      expect(currentState.foo).to.equal('bar');
      done();
    });
  });

  it('should return initial state when promise fails', (done) => {
    const restorePromise = () => new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('foo error'));
      }, 0);
    });

    const store = createStore(identity, { foo: '' }, compose(restoreReduxStore(restorePromise())));

    store.subscribe(() => {
      const currentState = store.getState();
      expect(currentState.foo).to.equal('');
      done();
    });
  });
});
