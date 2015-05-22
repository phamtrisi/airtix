var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  CronJob = require('cron').CronJob,
  Airbnb = require('./airapi/Airbnb'),
  _ = require('lodash'),
  nodemailer = require('nodemailer'),
  creds = require('./config/creds');


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
console.log('Cron jobs starting');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: creds.gmail.username,
    pass: creds.gmail.password
  }
});

// Get transactions every 2 hours
var watchHosting = new CronJob({
  cronTime: '0 */5 * * * *',
  onTick: function() {
    Airbnb.availability(277882, {
      count: 12
    }, function(err, res, info) {
      var availableDates = info.calendar_months.map(function(month) {
        return month.days.filter(function(day) {
          return day.available;
        });
      }).reduce(function(list, cur) {
        return list.concat(cur);
      }, []);

      if (availableDates.length > 1) {
        // email me
        var mailOptions = {
          from: 'Si Pham <phamtrisi@gmail.com>', // sender address
          to: 'phamtrisi@gmail.com', // list of receivers
          subject: 'Original airbnb listing is available!', // Subject line
          text: 'The original airbnb listing is available. Go to https://www.airbnb.com/rooms/277882 to check it out!', // plaintext body
          html: 'The original airbnb listing is available. Go to https://www.airbnb.com/rooms/277882 to check it out!' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });
      }
    });
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});

// expose app           
exports = module.exports = app;
