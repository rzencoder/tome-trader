//Requirements
import axios from 'axios';

export const UPDATE_USER = 'UPDATE_USER';
export const HANDLE_ERROR = 'HANDLE_ERROR';

function handleError(user) {
	return {
		type: HANDLE_ERROR,
		user
	}
};

function updateUser(user) {
	return {
		type: UPDATE_USER,
		user
	}
};

export function changeLocation(data) {
  return dispatch => {
    return axios.post('/api/changelocation', data).then( response => {
      dispatch(updateUser(response.data.user));
    }).catch(err => {
         console.log('Login Error');
    });
  }
}

export function requestTrade(data) {
	return dispatch => {
		axios.post('/api/requesttrade', data).then( response => {
			dispatch(updateUser(response.data.user));
		}).catch(err => {
				console.log(err);
				dispatch(handleError(err.response.data));
			});
	}
};

export function acceptTrade(data) {
	return dispatch => {
		axios.post('/api/accepttrade', data).then( response => {
			dispatch(updateUser(response.data.user));
		}).catch(err => console.log(err));
	}
};

export function declineTrade(data) {
	return dispatch => {
		axios.post('/api/declinetrade', data).then( response => {
			dispatch(updateUser(response.data.user));
		}).catch(err => console.log(err));
	}
};
