//requirements
require('dotenv').load();
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const Book = require('../models/books');

const app = module.exports = express.Router();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Register

app.post('/register', function(req, res, next) {
	if(req.body.password.length < 6){
		return res.status(401).send({
      error: "Password needs to be at least six characters long"
    });
	}
	if(req.body.password !== req.body.confirmPassword){
		return res.status(401).send({
      error: "Passwords don't match"
    });
	}
	//Check if username already taken
	User.findOne({username: req.body.username,
  	}, function(err, user) {
        if (err) {
            return done(err);
        }
		//if username unique create new user
		if (!user) {
			User.register(new User({
				username: req.body.username,
				tradeSent: [],
				tradeReceived: []
			}), req.body.password, function(err, account) {
				if (err) {
					return next(err);
				}
				passport.authenticate('local')(req, res, function() {
					req.session.save(function(err) {
						if (err) {
							return next(err);
						}
						res.redirect('/profile');
					});
				});
			});
		} else {
			return res.status(401).send({
				error: "Username already exists"
			});
		}
	});
});

//Login

app.post('/login', passport.authenticate('local'), function (req, res) {
	res.json({data:'success'})
});

//Logout

app.get('/logout', function(req, res) {
	req.logout();
	res.json({
		logout: true
	});
});

//Verify Logged In

app.post('/auth/verify', (req, res) => {
  if (req.isAuthenticated()) {
		User.findOne({"username": req.user.username}, function(err, user){
			if (err) throw err;
			Book.find({owner: req.user.username}, function(err, result){
				if (err) throw err;
				res.status(201).send({
		      username: req.user.username,
					books: result,
					tradeSent: user.tradeSent,
					tradeReceived: user.tradeReceived,
					city: user.city,
					country: user.country
		    });
			})
		})
  } else {
	    res.status(403).send({
	      error: "Not Authorized"
	    })
	  }
});
