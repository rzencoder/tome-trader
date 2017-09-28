//Requirements
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import books from './books';
import user from './user';

//Combine books and user reducers
const rootReducer = combineReducers({books, user, routing: routerReducer });

export default rootReducer;
