// QUESTION MODEL
// Import mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  text: String, 
  options: [{type: Schema.ObjectId, ref: 'Option'}]
}, {
  collection: 'questions'
});

module.exports = mongoose.model('Question', QuestionSchema);