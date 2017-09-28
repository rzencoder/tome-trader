//Requirements
import axios from 'axios';

export const SAVE_BOOKS = 'SAVE_BOOKS';
export const SAVE_USER_BOOKS = 'SAVE_USER_BOOKS';

function saveUserBooks(user) {
	return {
		type: SAVE_USER_BOOKS,
		user
	}
};

function saveBooks(books) {
	return {
		type: SAVE_BOOKS,
		books
	}
};

export function addBook(data) {
	return dispatch => {
		axios.post('/api/addbook', data).then( response => {
			dispatch(saveUserBooks(response.data.user));
		}).catch(err => console.log(err));
	}
}

export function deleteBook(data) {
	return dispatch => {
		axios.post('/api/deletebook', data).then( response => {
			dispatch(saveUserBooks(response.data.user));
		}).catch(err => console.log(err));
	}
}

export function getAllBooks() {
	return dispatch => {
		axios.get('/api/getallbooks').then( response => {
			dispatch(saveBooks(response.data.data));
		}).catch(err => console.log(err));
	}
};
