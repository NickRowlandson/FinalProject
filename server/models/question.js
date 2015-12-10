// Import mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  text: String,
  answer: {type: Schema.ObjectId, ref: 'Option'},
  creator: {type: Schema.ObjectId, ref: 'Survey'},
  created: Number,
  updated: Number
}, {
  collection: 'questions'
});

module.exports = mongoose.model('Question', QuestionSchema);