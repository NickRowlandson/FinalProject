// Import mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurveySchema = new Schema({

  provider:String,
  providerId: String,
  providerData: {},
  created: Number,
  updated: Number
}, {
  collection: 'surveyInfo'
});

module.exports = mongoose.model('Survey', SurveySchema);