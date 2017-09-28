//Requirements
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/index';
import api from './middleware/api';

//Create Default State
const books = [];
const user = {};
const defaultState = {
  books,
  user
};

//applymiddleware
let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore);

//create and sync history to store
let store = createStoreWithMiddleware(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const history = syncHistoryWithStore(browserHistory, store);

export default store;
