var CronJob = require('cron').CronJob,
    models = require('./app/models/models'),
    SouthwestScraper = require('./app/scraper/Southwest');

// Get transactions every 2 hours
var updatePrices = new CronJob({
      cronTime: '0 */10 * * * *',
      onTick: function() {
        console.log('Getting price updates');
        
        function _toDateString(d) {
        	return [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/');
        }

        models.PriceWatch.all().then(function(priceWatches) {
        	priceWatches.forEach(function(priceWatch) {
        		SouthwestScraper.getPrices(priceWatch.from_airport, priceWatch.to_airport, _toDateString(priceWatch.date), {
              priceWatchId: priceWatch.id
            });
        	});
        });
        
      },
      start: false,
      timeZone: 'America/Los_Angeles'
    });

updatePrices.start();