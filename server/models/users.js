const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	country: {
		type: String,
		required: false,
		trim: true
	},
	city: {
		type: String,
		default: '',
		trim: true
	},
	tradeSent: {
		type: Array,
	},
	tradeReceived: {
		type: Array
	}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
