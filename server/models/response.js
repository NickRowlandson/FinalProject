// RESPONSE MODEL
// Import mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  question: {type: Schema.ObjectId, ref: 'Question'},
  answer: {type: String}
}, {
  collection: 'answers'
});

module.exports = mongoose.model('Answer', AnswerSchema);