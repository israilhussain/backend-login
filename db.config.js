var mongoose = require('mongoose');

//connect to MongoDB
mongoose.connect('mongodb://israil:23israil@ds047448.mlab.com:47448/todo');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('openUri', () => {
  console.log('database connected')
});

module.exports = db;
