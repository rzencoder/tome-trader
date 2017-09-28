//Requirements
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Book from './Book';
import { getAllBooks } from '../actions/books'

function mapStateToProps (state) {
  return { user: state.user, books: state.books  };
}

function mapDispatchToProps (dispatch) {
  return { getAllBooks: bindActionCreators(getAllBooks, dispatch) };
}

//Book Container Component
class Books extends Component {
	constructor () {
		super();
		this.state = {
			showModal: false
		};
    this.deleteUserBook = this.deleteUserBook.bind(this);
	}

	componentWillMount(){
		this.props.getAllBooks();
	}

  deleteUserBook (id) {
    this.props.deleteBook({"id": id});
  }

	render () {
    //Display all users books on profile page and all non user books on main books page
		let books = this.props.books;
		let arr = [];
		books.forEach( (book, i) => {
			if (book.owner !== this.props.user.username) {
				arr.push(
					<Book key={i} book={book} trade={true} location={"books"} deleteUserBook={this.deleteUserBook} />
				);
			}
		});

		return (
			<div>
				<h2 className="books-title">Latest Books</h2>
        {this.props.user.errorMessage ? <div className="books-message">{this.props.user.errorMessage}</div> : ''}
				<div className="bookcase-frame">
					{arr}
				</div>
			</div>
		);

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Books);
