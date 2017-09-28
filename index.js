// dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./server/routes/api');
const authRoutes = require('./server/routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
app.use('/public', express.static(path.join(__dirname, 'public')));

// mongoose
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tometrader');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use(apiRoutes);

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'public', '/index.html'));
});

app.listen(PORT, function () {
	console.log(`Listening on port ${PORT}`);
});
