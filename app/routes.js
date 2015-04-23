var epilogue = require('epilogue'),
    models = require('./models/models.js');

module.exports = function(app) {
  epilogue.initialize({
    app: app,
    sequelize: models.sequelize,
    base: '/api'
  });

  var itemsApi = epilogue.resource({
    model: models.Item,
    endpoints: ['/items', '/items/:id']
  });


  // THE REST
  app.get('*', function(req, res) {
    res.sendfile('./static/templates/index.html'); // load our public/index.html file
  });
};
