// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var Sequelize = require('sequelize');
var restful   = require('sequelize-restful');
var epilogue = require('epilogue');


// config files
var db = require('./config/db');
var models = require('./app/models/models');   

//app.use(restful(models.sequelize, { /* options */ }));
epilogue.initialize({
  app: app,
  sequelize: models.sequelize,
  base: '/api',
  updateMethod: 'POST'
});

var transactionResource = epilogue.resource({
      model: models.Transaction,
      endpoints: ['/transactions', '/transactions/:id'],
      pagination: false
    }),
    categoriesResource = epilogue.resource({
      model: models.Category,
      endpoints: ['/categoriess', '/categoriess/:id'],
      pagination: false
    });

// set our port
var port = process.env.PORT || 8000; 

app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

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
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;                         
