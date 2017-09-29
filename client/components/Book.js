//Requirements
import React, { Component } from 'react';
import Modal from 'react-modal';
import ShowMore from 'react-show-more';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getAllBooks } from '../actions/books';
import { requestTrade } from '../actions/user';

function mapStateToProps (state) {
  return { user: state.user };
}

function mapDispatchToProps (dispatch) {
  return { requestTrade: bindActionCreators(requestTrade, dispatch) };
}

//Star component for star ratings of books
const Stars = (props) => {
	return (
		<div className={`rating medium star-icon direction-ltf value-${props.rating}`}>
			<div className="star-container">
				<div className="star">
					<i className="star-empty"></i>
					<i className="star-half"></i>
					<i className="star-filled"></i>
				</div>
				<div className="star">
					<i className="star-empty"></i>
					<i className="star-half"></i>
					<i className="star-filled"></i>
				</div>
				<div className="star">
					<i className="star-empty"></i>
					<i className="star-half"></i>
					<i className="star-filled"></i>
				</div>
				<div className="star">
					<i className="star-empty"></i>
					<i className="star-half"></i>
					<i className="star-filled"></i>
				</div>
				<div className="star">
					<i className="star-empty"></i>
					<i className="star-half"></i>
					<i className="star-filled"></i>
				</div>
			</div>
		</div>
	);
};

//Book Component
class Book extends Component {
	constructor (props) {
		super(props);
		this.state = {
			showModal: false,
			value: this.props.user.isAuthenticated && this.props.user.books.length !== 0 ? this.props.user.books[0]._id : ''
		};

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.changeValue = this.changeValue.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleOpenModal () {
		this.setState({ showModal: true });
	}

	handleCloseModal () {
		this.setState({ showModal: false });
	}

	changeValue (event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit (event) {
        event.preventDefault();
        if(this.state.value !== ''){        
            this.props.requestTrade({
                "id": this.state.value,
                "username": this.props.user.username,
                "ownerBookId": this.props.book._id,
                "ownerUsername": this.props.book.owner
            });
            this.setState({ showModal: false });
        }
	}

	render () {

    //Add users books to dropdown for possible trade with other users
		let dropdown = [];
    if(this.props.user.isAuthenticated){
  		this.props.user.books.forEach(book => {
  			dropdown.push(<option key={book._id} value={book._id}>{book.title}</option>)
  		});
    }

		return (

			<div className="book-wrapper">
				<img src={this.props.book.imageUrl} alt={this.props.book.title} onClick={this.handleOpenModal}/>
				<Modal
					isOpen={this.state.showModal}
					onRequestClose={this.handleCloseModal}
					contentLabel=""
					className="modal"
					overlayClassName="overlay"
				>
					<div className="modal-container">
						<div className="modal-content">
							<img className="modal-img" src={this.props.book.imageUrl} alt={this.props.book.title}/>
							<div className="modal-details">
								<p className="book-title">{this.props.book.title}</p>
								<p>{this.props.book.author}</p>
								<Stars rating={Math.ceil(this.props.book.rating)}/>
								<p>Pages: {this.props.book.pages}</p>
								{this.props.user.isAuthenticated && this.props.location === "books"
                  ?
                  <div>Request trade for
                    <form className="trade-form" onSubmit={this.handleSubmit}>
                      <select value={this.state.value} onChange={this.changeValue}>{dropdown}</select>
                      <input className="btn btn-trade" type="submit" value="Submit" />
                    </form></div>
                  :
                  '' }
                
								{this.props.location === "profile" ?
                  <button onClick={ () => {this.props.deleteUserBook(this.props.book._id); this.setState({ showModal: false });}}
                    className="btn btn-trade">Delete Book
                  </button> : '' }

							</div>
						</div>
						<div className="book-description">
							<ShowMore
								lines={3}
								more='Show more'
								less='Show less'
								anchorClass='showmore'
							>
								{this.props.book.description}
							</ShowMore>
						</div>
						<i className="fa fa-times close-modal" aria-hidden="true" onClick={this.handleCloseModal}></i>
					</div>
				</Modal>
			</div>
		);
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(Book)
