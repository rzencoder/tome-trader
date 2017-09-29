//Requirements
import axios from 'axios';
import { browserHistory } from 'react-router';

const path = 'https://tometrader.herokuapp.com';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isAuthenticated: true,
    username: user.username,
    tradeSent: user.tradeSent,
    tradeReceived: user.tradeReceived,
    books: user.books,
    city: user.city,
    country: user.country
  }
}

function logoutUser() {
  return {
    type: LOGOUT,
    isAuthenticated: false,
    username: '',
    books: [],
    tradeReceived: [],
    tradeSent: [],
    city: '',
    country: ''
  }
}

function loginError(error) {
  return {
    type: LOGIN_FAILURE,
    isAuthenticated: false,
    username: '',
    error
  }
}

export function checkAuth() {
  return dispatch => {
    return axios.post(path + '/auth/verify').then ( res => {
        dispatch(receiveLogin(res.data));
    }).catch(err => {
         console.log('Login Required', err.response.data);
         dispatch(loginError(err.response.data));
         browserHistory.push('/');
    });
  }
}

export function login(data) {
  return dispatch => {
    return axios.post(path + '/login', data).then ( res => {
      browserHistory.push('/profile');
    }).catch(err => {
         console.log('Login Required', err.response.data);
         dispatch(loginError(err.response.data));
    });
  }
}

export function register(data) {
  return dispatch => {
    return axios.post(path + '/register', data).then ( res => {
      browserHistory.push('/profile');
    }).catch(err => {
         console.log('Login Required', err.response.data);
         dispatch(loginError(err.response.data.error));
    });
  }
}

export function logout() {
  return dispatch => {
    return axios.get(path + '/logout').then( res => {
      dispatch(logoutUser());
      browserHistory.push('/');
    }).catch(err => {
         console.log('Logout Error');
    });
  }
}
