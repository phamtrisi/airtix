var db = require('../config/db');
var models = require('./models/models');

module.exports = function(app) {
  // API
  app.get('/api/categories', function(req, res) {
    models.Category.findAll({
      where: {
        categoryId: null
      },
      include: [{ model: models.Category, as: 'subCategories' }]
    }).then(function(categories) {      
      res.json(categories);
    });
  });


  // THE REST
  app.get('*', function(req, res) {
    res.render('../static/index.html'); // load our public/index.html file
  });
};