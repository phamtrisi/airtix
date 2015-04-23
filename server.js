// modules =================================================
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    Sequelize = require('sequelize'),
    epilogue = require('epilogue'),
    http = require('follow-redirects').http,
    https = require('follow-redirects').https,
    cheerio = require('cheerio'),
    request = require('request');

// set our port
var port = process.env.PORT || 8000;

app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /static/img will be /img for users
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/static/templates');

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8000
app.listen(port);

// shoutout to the user                     
console.log('App running on port ' + port);

// expose app           
exports = module.exports = app;
