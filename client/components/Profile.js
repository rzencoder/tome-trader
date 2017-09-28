//Requirements
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { checkAuth, logout } from '../actions/auth';
import { addBook, deleteBook } from '../actions/books';
import { acceptTrade, declineTrade } from '../actions/user';
import Account from './Account';
import Book from './Book';

function mapStateToProps (state) {
  return { user: state.user, books: state.books  };
}

function mapDispatchToProps (dispatch) {
  return { checkAuth: bindActionCreators(checkAuth, dispatch),
           logout: bindActionCreators(logout, dispatch),
           addBook: bindActionCreators(addBook, dispatch),
           deleteBook: bindActionCreators(deleteBook, dispatch),
           acceptTrade: bindActionCreators(acceptTrade, dispatch),
           declineTrade: bindActionCreators(declineTrade, dispatch)
         };
}

//Profile Page Component
class Profile extends Component {
	constructor (props) {
		super();
		this.state = {
			title: '',
      author: '',
      message: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.search = this.search.bind(this);
    this.deleteUserBook = this.deleteUserBook.bind(this);
    this.logout = this.logout.bind(this);
    this.acceptTrade = this.acceptTrade.bind(this);
    this.declineTrade = this.declineTrade.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
	}

  componentWillMount () {
		this.props.checkAuth();
	}

  handleChange (e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

  displayMessage (input) {
    this.setState({message: input});
  }

	search (e) {
		e.preventDefault();
    this.props.addBook({"title": this.state.title,
                        "author": this.state.author });
    this.displayMessage("New Book Added");
	}

  acceptTrade (event) {
    const trade = this.props.user.tradeReceived[event.target.value];
    this.props.acceptTrade({
      "id": trade.requested.id,
			"username": this.props.user.username,
			"ownerBookId": trade.offer.id,
			"ownerUsername": trade.offer.owner
    });
    this.displayMessage("Trade Accepted");
  }

  declineTrade (event) {
    const trade = this.props.user.tradeReceived[event.target.value];
    this.props.declineTrade({
      "id": trade.requested.id,
			"username": this.props.user.username,
			"ownerBookId": trade.offer.id,
			"ownerUsername": trade.offer.owner
    });
    this.displayMessage("Trade Declined");
  }

  logout () {
    this.props.logout();
	}

  deleteUserBook (id) {
    this.props.deleteBook({"id": id});
    this.displayMessage("Book Deleted");
  }

	render () {

    //Display all trades that user has sent
    let sentArr = [];
    if (this.props.user.tradeSent) {
      this.props.user.tradeSent.forEach((trade, i) => {
        sentArr.push(
          <div className="trade-sent"key={i + 100}>
            <p><b>To: </b>{trade.requested.owner}</p>
            <p><b>Your Offer: </b>{trade.sent.title}</p>
            <p><b>Your Request: </b>{trade.requested.title}</p>
            <p className="decision-message">Awaiting decision from {trade.requested.owner}</p>
          </div>
        )
      })
    }

    //Display all trades that user has received
    let receivedArr = [];
    if (this.props.user.tradeReceived) {
      this.props.user.tradeReceived.forEach((trade, i) => {
        sentArr.push(
          <div className="trade-received" key={i + 200}>
            <div>
              <p><b>From: </b>{trade.offer.owner}</p>
              <p><b>Their Offer: </b>{trade.offer.title}</p>
              <p><b>Their Request: </b>{trade.requested.title}</p>
            </div>
            <button className="btn accept-btn" value={i} onClick={this.acceptTrade}>Accept Trade</button>
            <button className="btn decline-btn" value={i} onClick={this.declineTrade}>Decline Trade</button>
          </div>
        )
      })
    }

    //Display user books
		var booksArr = [];
		if (this.props.user.books) {
			this.props.user.books.forEach( book => {
				booksArr.push(
					<Book key={book._id}
                book={book}
                location={"profile"}
                deleteUserBook={this.deleteUserBook}
          />
				);
			});
		}

		return (
			<div className="profile-container">
				<div className="profile-info">
					<div className="user-details">
						<h2>{this.props.user.username}</h2>
						<div><Link to="/account">Account Settings</Link></div>
						<div className="logout-btn" onClick={this.logout}>Logout</div>
					</div>
					<div className="addbook">
						<h2>Add Book</h2>
						<form onSubmit={this.search.bind(this)}>
							<input className="form-control" type='text' name="title" placeholder="Title"
								value={this.state.title} onChange={this.handleChange}></input>
              <input className="form-control" type='text' name="author" placeholder="Optional Author Surname"
								value={this.state.author} onChange={this.handleChange}></input>
							<button className="btn btn-submit add-book-btn" type="submit">Submit</button>
						</form>
					</div>
				</div>
				<div className="mybooks">

          {receivedArr.length === 0 && sentArr.length === 0 ? '' : <h1>Trades</h1>}
          <div>
            <div>{sentArr}</div>
            <div> {receivedArr}</div>
          </div>
          {this.state.message ? <div className="message">{this.state.message}</div> : ''}
					<h1>Your Books</h1>
					<div className="bookcase-frame">
						{booksArr}
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
