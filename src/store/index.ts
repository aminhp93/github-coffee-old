import { createStore, applyMiddleware, compose } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import rootReducer from 'reducers';
import { Action } from '@reduxjs/toolkit';

const composeEnhancers =
  typeof window === 'object' &&
  process.env.NODE_ENV === 'development' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));
const store = createStore(rootReducer, enhancer);

export type DispatchType = typeof store.dispatch;

export type RootStateType = ReturnType<typeof rootReducer>;

export type ThunkActionType = ThunkAction<
  void,
  RootStateType,
  unknown,
  Action<string>
>;

export default store;
