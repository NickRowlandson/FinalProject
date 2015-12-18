// SURVEY MODEL
// Import mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurveySchema = new Schema({
  name: String,
  description: String, 
  type: String,
  questions: [{type: Schema.ObjectId, ref: 'Question'}],
  creator: {type: Schema.ObjectId, ref: 'User'},
  created: Number,
  updated: Number
}, {
  collection: 'surveys'
});

module.exports = mongoose.model('Survey', SurveySchema);