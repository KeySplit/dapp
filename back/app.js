var express        = require('express');
var session 	   = require('express-session');
var bodyParser     = require('body-parser');

/* app setup */
var app = express();

// set location for static files to public dir
app.use(express.static(__dirname + '/../front')); 

// init body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app); 

/* app startup */
var port = process.env.PORT || 5000;
app.listen(port);                                  
console.log('KeySplit is listening on port ' + port);
exports = module.exports = app; 