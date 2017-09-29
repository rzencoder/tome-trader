//Requirements
const express = require('express');
const User = require('../models/users');
const Books = require('../models/books');
const axios = require('axios');

const app = module.exports = express.Router();

// Answer API requests.

//Get all books to display

app.get('/api/getallbooks', (req, res) => {
	Books
		.find({})
			.exec((err, result) => {
				if (err) console.log(err);
				res.status(201).json({
					data: result
				});
			});
});

//Update Location

app.post('/api/changelocation', (req, res) => {
	User.findOneAndUpdate({
		'username': req.user.username
	}, {city: req.body.city, country: req.body.country}, {upsert: true},
	 (err, user) => {
		if (err) console.log(err);
		Books
			.find({owner: req.user.username})
			.exec(function(err, result) {
				if (err) console.log(err);
				res.status(201).json({
					user: {
						username: req.user.username,
						city: req.body.city,
						country: req.body.country,
						tradeSent: user.tradeSent,
						tradeReceived: user.tradeReceived,
						books: result
					}
				});
			});
	});
});

//Add New Book

app.post('/api/addbook', (req, res) => {
	let author = '';
	if (req.body.author){
		author = '+inauthor:' + req.body.author;
	}
	//Google Books API
	const url = 'https://www.googleapis.com/books/v1/volumes?q=' + req.body.title + author + '&key=' + process.env.GOOGLE_BOOKS_KEY;
	axios(url)
		.then(response => {
			const data = response.data.items[0].volumeInfo;
			const book = new Books({
				owner: req.user.username,
				title: data.title,
				author: data.authors[0],
				description: data.description,
				imageUrl: data.imageLinks.thumbnail,
				rating: data.averageRating,
				pages: data.pageCount
			});
			User
				.findOne({
					'username': req.user.username
				}, {})
					.exec((err, user) => {
						if (err) console.log(err);
			book.save((err, book) => {
				if (err) console.error(err);
				//Update book list
				Books
					.find({owner: req.user.username})
					.exec((err, result) => {
						if (err) console.log(err);
						res.status(201).json({
							user: {
								username: req.user.username,
								city: user.city,
								country: user.country,
								tradeSent: user.tradeSent,
								tradeReceived: user.tradeReceived,
								books: result
							}
						});
					});
				});
			});
		})
		.catch(err => console.log(err));
});

//Delete Book

app.post('/api/deletebook', function (req, res) {
	Books
		.findOne({_id: req.body.id})
		.remove()
		.exec(function(err, documents) {
			if (err) return console.log(err);
			User
				.findOne({username: req.user.username})
				.exec(function(err, user){
					if (err) return console.log(err);

					//Remove trades from user and all trades including deleted book
					let tradeSentArr = [];
					let tradeReceivedArr = [];
					let otherArr = [];

					user.tradeSent.forEach(trade => {
						if(trade.sent.id === req.body.id){
							otherArr.push(trade.requested.owner);
						} else {
							tradeSentArr.push(trade)
						}
					});

					user.tradeReceived.forEach(trade => {
						if(trade.requested.id === req.body.id){
							otherArr.push(trade.offer.owner);
						} else {
							tradeReceivedArr.push(trade)
						}
					});

					user.tradeReceived = tradeReceivedArr;
					user.tradeSent = tradeSentArr;
					user.save();

					//Remove duplicate users
					let userList = [...new Set(otherArr)];
					userList.forEach(otherUser => {
						User
							.findOne({username: otherUser})
							.exec(function(err, other){
								if (err) return console.log(err);
								let tempReceivedArr = [];
								let tempSentArr = [];

								other.tradeReceived.forEach(trade => {
									if(trade.offer.id !== req.body.id){
										tempReceivedArr.push(trade);
									}
								});

								other.tradeSent.forEach(trade => {
									if(trade.requested.id !== req.body.id){
										tempSentArr.push(trade);
									}
								});

								other.tradeReceived = tempReceivedArr;
								other.tradeSent = tempSentArr;
								other.save();
							});
					});

				Books
					.find({owner: req.user.username})
					.exec(function(err, result) {
						if (err) return console.log(err);
						res.status(201).json({
							user: {
								username: req.user.username,
								city: user.city,
								country: user.country,
								tradeSent: user.tradeSent,
								tradeReceived: user.tradeReceived,
								books: result
							}
						});
					});
				});
		});
});

//Request Trade

app.post('/api/requesttrade', function (req, res) {
	const { id, username, ownerBookId, ownerUsername } = req.body;
	//Find Requester and Owner and Books in DB
	User.findOne({"username": username}, function (err, user) {
		if (err) throw err;
		Books.findById(ownerBookId, function (err, ownerBook){
			if (err) throw err;
			//Check to see if trade is identical to any other stored on DB
			Books.findById(id, function (err, book){
				if (err) throw err;
				let alreadyRequested = user.tradeSent.some(trade => {
					return trade.sent.id === id && trade.requested.id === ownerBookId
				});
				if (alreadyRequested) {
					return res.status(401).json({
						error: "Already Requested"
					});
				}
				//If not identical add to the requester and owners trade lists
				user.tradeSent.push({
					"sent": {
						"id": id,
						"title": book.title,
						"author": book.author
					},
				 "requested": {
					 "id": ownerBookId,
					 "owner": ownerUsername,
					 "title": ownerBook.title,
					 "author": ownerBook.author
				  }
			  });
				user.save();
				User.findOne({"username": ownerUsername}, function (err, owner) {
				if (err) throw err;
					owner.tradeReceived.push({
						"offer": {
							"id": id,
							"title": book.title,
							"author": book.author,
							"owner": username
						},
						"requested": {
							"id": ownerBookId,
							"title": ownerBook.title,
							"author": ownerBook.author
						}
					});
					owner.save();
					Books
						.find({owner: req.user.username})
						.exec(function(err, result) {
							if (err) console.log(err);
							return res.status(201).json({
								user: {
									username: req.user.username,
									city: user.city,
									country: user.country,
									tradeSent: user.tradeSent,
									tradeReceived: user.tradeReceived,
									errorMessage: 'Trade Requested',
									books: result
								}
							});
						});
				});
			});
		});
	});
});

//Refuse Trade

app.post('/api/declinetrade', function (req, res) {
	const { id, username, ownerBookId, ownerUsername } = req.body;
	//Remove trade from refusers trade list
	User.findOne({username: username}, function(err, user){
		const newTradeReceived = [];
		user.tradeReceived.forEach(trade => {
			if(trade.offer.id === ownerBookId && trade.requested.id === id){

			} else {
				newTradeReceived.push(trade);
			}
		});
		user.tradeReceived = newTradeReceived;
		user.save();

		//Remove trade from requesters trade list
		User.findOne({username: ownerUsername}, function(err, owner){
			const newTradeSent = [];
			owner.tradeSent.forEach(trade => {
				if(trade.sent.id === ownerBookId && trade.requested.id === id){

				} else {
					newTradeReceived.push(trade);
				}
			});
			owner.tradeSent = newTradeSent;
			owner.save();

			Books
				.find({owner: req.user.username})
				.exec(function(err, result) {
					if (err) {
						return console.log(err);
					}
					res.status(201).json({
						user: {
							username: req.user.username,
							city: user.city,
							country: user.country,
							tradeSent: user.tradeSent,
							tradeReceived: user.tradeReceived,
							books: result
						}
					});
				});
		});
	});
});

//Accept Trade

app.post('/api/accepttrade', function (req, res) {
	const { id, username, ownerBookId, ownerUsername } = req.body;
	let usersArr = [];
	//Delete all trades with both books
	User.findOne({username: username}, function(err, user){
		let newTradeReceived = [];
		user.tradeReceived.forEach(trade => {
			if(trade.offer.id === ownerBookId){

			}
			else if (trade.requested.id === id) {
				usersArr.push(trade.offer.owner);
			}
			else {
				newTradeReceived.push(trade);
			}
		});

		let newTradeSent = [];
		user.tradeSent.forEach(trade => {
			if(trade.sent.id === id){

			}
			else if (trade.requested.id === ownerBookId) {
				usersArr.push(trade.requested.owner);

			}
			else {
				newTradeSent.push(trade);
			}
		});

		user.tradeReceived = newTradeReceived;
		user.tradeSent = newTradeSent;
		user.save();

		//Delete all trades containing the two books from user to be traded with
		User.findOne({username: ownerUsername}, function(err, ownerUser){
			let ownerTradeReceived = [];
			ownerUser.tradeReceived.forEach(trade => {
				if(trade.offer.id === id){

				}
				else if (trade.requested.id === ownerBookId) {
					usersArr.push(trade.offer.owner);
				}
				else {
					ownerTradeReceived.push(trade);
				}
			});

			let ownerTradeSent = [];
			ownerUser.tradeSent.forEach(trade => {
				if(trade.sent.id === ownerBookId){

				}
				else if (trade.requested.id === id) {
					usersArr.push(trade.requested.owner);
				}
				else {
					ownerTradeSent.push(trade);
				}
			});

			ownerUser.tradeReceived = ownerTradeReceived;
			ownerUser.tradeSent = ownerTradeSent;
			ownerUser.save();

			//Remove duplicate users
			let tempList = [...new Set(usersArr)];
			let userList = tempList.filter(item => {
				return item !== username && item !== ownerUsername
			});

			//Delete trades from any user who has requested a trade with the two books
			userList.forEach(i => {
				User.findOne({username: i}, function(err, item){
					let itemTradeReceived = [];
					item.tradeReceived.forEach(trade => {
						if(trade.offer.id === ownerBookId || trade.requested.id === id ||
						   trade.offer.id === id || trade.requested.id === ownerBookId ){
						}
						else {
							itemTradeReceived.push(trade);
						}
					});

					let itemTradeSent = [];
					item.tradeSent.forEach(trade => {
						if(trade.sent.id === id || trade.requested.id === ownerBookId ||
						   trade.sent.id === ownerBookId || trade.requested.id === id ){
						}
						else {
							itemTradeSent.push(trade);
						}
					});

					item.tradeReceived = itemTradeReceived;
					item.tradeSent = itemTradeSent;
					item.save();

				});
			});

			//Swap Books over
			Books.findById(ownerBookId).exec(function(err, ownbook){
				ownbook.owner = username,
				ownbook.save();

				Books.findById(id).exec(function(err, book){
					book.owner = ownerUsername,
					book.save(function(){

					Books
						.find({owner: username})
						.exec(function(err, result) {
							if (err) return console.log(err);
							res.status(201).json({
								user: {
									username: req.user.username,
									city: user.city,
									country: user.country,
									tradeSent: user.tradeSent,
									tradeReceived: user.tradeReceived,
									books: result,
									errorMessage: ''
								}
							});
						});
					});
				});
			});
		});
	});
});
