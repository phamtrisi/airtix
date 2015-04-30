var express = require('express'),
		router = express.Router(),
		models = require('./models/models');

router.get('/price_watches', function(req, res) {
  models.PriceWatch.findAll({
  	include: [
  		{
  			model: PriceLog
  		}
  	]
  }).then(function(priceWatches) {
  	res.json(priceWatches);
  });
});

module.exports = router;