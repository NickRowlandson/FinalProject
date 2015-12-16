// Import mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  answer: String, 
}, {
  collection: 'answers'
});

module.exports = mongoose.model('Answer', ResponseSchema);