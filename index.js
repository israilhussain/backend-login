var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//db connection
var db = require('./db.config');

//user model
var User = require('./models/user');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//use sessions for tracking logins
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//Creating Router() object
var routes = require('./routes/router');
app.use("/api",routes);

// Listen to this Port
app.listen(8000, () => {
  console.log("Live at Port 8000");
});