(function(){
  var app = require('../app');
  var http = require('http');
  
  var server = http.createServer(app);
  
  server.listen(process.env.PORT || '3000');
}());