var express = require('express');
var User = require('../models/user');
var Validators = require('../utils/validator');
var router = express.Router();

// Email and Password Validator functions
var emailValidator = Validators.emailValidator;
var passwordValidator = Validators.passwordValidator;

// Signup
router.post('/signup', (req, res, next) => {

  const { username, email, password, confirm_password, admin } = req.body;

  if (email && username && password && confirm_password && admin ) {
   
  	if (!emailValidator.validate(email)) {

      return res.status(400).send({ succes: false, message: 'Please enter a valid email.' });
      return next();
  	}
  	if (passwordValidator.validate(password)) {

  	  if (password !== confirm_password) {
        return res.status(400).send({ succes: false, message: 'Passwords do not match.' });
        return next();
       }
  	}else {

  	  return res.status(400).send({ 
  	  	succes: false,
  	  	message: `Password must contain at least 1 lowercase
  	  	,uppercase, number, special character and 8 in length.` });
      return next(err);
  	}

    var userData = {
      email,
      username,
      password,
      confirm_password,
      admin,
    }

    const newUser = new User(userData);

    newUser.save(function(err, user) {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
          return res.status(500).send({ succes: false, message: 'User already exist!' });
        }
        // Some other error
        return res.status(500).send(err);
      }

      req.session.userId = user._id;
      return res.json(user);
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }

});

// Login
router.post('/login', (req, res, next) => {

  const { email, password } = req.body;
  
  if (email && password) {
    User.authenticate(email, password, (error, user) => {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        //If the user is a admin implies user.admin == true, then find all the normal users
        if (user.admin) {
          User.find({admin: false})
        	.then(users => res.json([user, ...users]))
        }else {
          return res.json(user);
        }
      }
    });
  }

});

// GET for logout logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.json({ login: false, message: 'User logged out!' });
      }
    });
  }
});

module.exports = router;
