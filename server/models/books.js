const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Book = new Schema({
	title: String,
	author: String,
	description: String,
	imageUrl: String,
	owner: String,
	rating: Number,
	pages: Number
});

module.exports = mongoose.model('Book', Book);
