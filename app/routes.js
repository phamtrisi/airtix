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


  // Endpoints to interact with Plaid
  // Add bank account using credentials and institution type
  // Validate MFA if required
  // Get transactions


  // THE REST
  app.get('/', function(req, res) {
    res.sendfile('./static/templates/index.html'); // load our public/index.html file
  });
};