# redux-dehydrate
Store enhancer for restoring the initial state of redux storage.

# Real world use case:
<will input>

# Usage
```javascript
// App.js

const { compose, createStore } from 'redux';
const reduxRestore from 'redux-dehydrate';
const { Provider } from 'react-redux';
const React, { render, Component } from 'react';
const { isEmpty } from 'lodash';

const initialState = { foo: 'bar' };
const rootReducer = (state = initialState, action) => {
  // handle actions
  return state;
};

const restoreStatePromise = () => Promise.resolve({ foo: 'bar' });

const enhancers = compose(
  reduxRestore(restoreStatePromise()),
  // middlewares
  // devtool
);

const store = createStore(rootReducer, initialState, enhancers);
const App = () => {
  <Provider store={store}>
    // children component
    <div />
  </Provider>
}

class Root extends Component {
  componentDidMount() {
    const unsubscribe = store.subscribe(() => {
      this.forceUpdate();
      unsubscribe();
    });
  }
  
  render() {
    if (isEmpty(store)) {
      return (
        <div>Loading store...</div>
      );
    }
    
    return <App />;
  }
}

render(<Root />, document.getElementById('root'));
```

# Notes:
If the restore promise returns false, the lib will use the `initalState` implicitly. 

# Credits: 
This lib couldn't be done without (a ton of) helps from [@tungv](https://github.com/tungv).  
Have question? Ask me on [@khanght](https://twitter.com/@khanght)

# License
What's license? just kidding, `redux-dehydrate` is available under the MIT license. See the LICENSE file for more info.
