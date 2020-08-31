import { createStore, applyMiddleware, compose } from 'redux';

import requestMiddleware from 'middleware/requestMiddleware';

import reducers from './reducers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlware = [requestMiddleware];

const composeStore = (initialState: {}) =>
  createStore(reducers, initialState, composeEnhancers(applyMiddleware(...middlware)));

export default function configureStore(initialState: {}) {
  const store = composeStore(initialState);

  return { store };
}
