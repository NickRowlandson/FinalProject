// Import mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionSchema = new Schema({
  text: String
}, {
  collection: 'options'
});

module.exports = mongoose.model('Option', OptionSchema);