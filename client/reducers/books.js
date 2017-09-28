import { SAVE_BOOKS } from '../actions/books'

//Books Reducer
const books = (state = [], action) => {
	switch(action.type) {

		case SAVE_BOOKS:
			const allBooks = action.books.slice();
			return allBooks;

		default:
			return state;
	}
}

export default books;
