var epilogue = require('epilogue'),
    models = require('./models/models'),
    api = require('./api');

module.exports = function(app) {
  // API STUFF
  // epilogue.initialize({
  //   app: app,
  //   sequelize: models.sequelize,
  //   base: '/api'
  // });

  // var priceWatchesApi = epilogue.resource({
  //   model: models.PriceWatch,
  //   endpoints: ['/price_watches', '/price_watches/:id']
  // });

  // app.get('/api/price_watches')
  app.use('/api', api);

  // THE REST
  app.get('*', function(req, res) {
    res.sendfile('./static/templates/index.html'); // load our public/index.html file
  });
};
