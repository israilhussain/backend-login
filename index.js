var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connect to MongoDB
mongoose.connect('mongodb://israil:23israil@ds047448.mlab.com:47448/todo');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('openUri', () => {
  console.log('database connected')
});

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
app.listen(3000, () => {
  console.log("Live at Port 3000");
});