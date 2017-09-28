//Requirements
import { combineReducers } from 'redux';
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/auth';
import { SAVE_USER_BOOKS } from '../actions/books';
import { UPDATE_USER, HANDLE_ERROR } from '../actions/user';

//Create Default State
const defaultState = {
  isAuthenticated: false,
  username: '',
  errorMessage: '',
  books: [],
  tradeSent: [],
  tradeReceived: [],
  city: '',
  country: ''
}

//User Reducer
const user = (state = defaultState, action) => {
  switch (action.type) {

    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        username: action.username,
        errorMessage: '',
        books: action.books,
        tradeSent: action.tradeSent,
        tradeReceived: action.tradeReceived,
        city: action.city,
        country: action.country
      });

    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isAuthenticated: false,
        username: '',
        errorMessage: action.error,
        books: []
      });

    case LOGOUT:
      return Object.assign({}, state, {
        isAuthenticated: false,
        username: '',
        errorMessage: '',
        books: [],
        tradeSent: [],
        tradeReceived: [],
        city: '',
        country: ''
      });

    case UPDATE_USER:
      return Object.assign({}, state, {
        isAuthenticated: true,
        username: action.user.username,
        errorMessage: action.user.errorMessage,
        books: action.user.books,
        tradeSent: action.user.tradeSent,
        tradeReceived: action.user.tradeReceived,
        city: action.user.city,
        country: action.user.country
      });

    case SAVE_USER_BOOKS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        username: action.user.username,
        errorMessage: '',
        books: action.user.books,
        tradeSent: action.user.tradeSent,
        tradeReceived: action.user.tradeReceived,
        city: action.user.city,
        country: action.user.country

    });

    case HANDLE_ERROR:
      return Object.assign({}, state, {
        errorMessage: action.user.error
    });

    default:
      return state;
  }
}

export default user;
