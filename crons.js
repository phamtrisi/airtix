var CronJob = require('cron').CronJob,
    models = require('./app/models/models'),
    SouthwestScraper = require('./app/scraper/Southwest');

// Get transactions every 2 hours
var updatePrices = new CronJob({
  cronTime: '*/5 * * * * *',
  onTick: function() {
    console.log('Getting price updates');
    SouthwestScraper.getPrices('SJC', 'HOU', '05/23/2015');
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});

updatePrices.start();