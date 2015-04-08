var db = require('../config/db'),
  creds = require('../config/creds');
var models = require('./models/models');
var plaid = require('plaid')({
  client_id: creds.plaid.client_id,
  secret: creds.plaid.secret
});


module.exports = function(app) {
  // API
  app.get('/api/categories', function(req, res) {
    models.Category.findAll({
      where: {
        categoryId: null
      },
      include: [{
        model: models.Category,
        as: 'subCategories'
      }]
    }).then(function(categories) {
      res.json(categories);
    });
  });


  // Endpoints to interact with Plaid
  // Add bank account using credentials and institution type
  // Validate MFA if required
  // Get transactions
  app.post('/api/account/add', function(req, res) {
    var data = req.body;

    /**
     * Connect/Add a user.
     */
    if (data) {
      plaid.connect({
        username: data.username,
        password: data.password
      }, data.institutionType, '', function(error, response, mfa) {

        //Non MFA or already added
        console.log(response, error)

        //MFA
        if (mfa) {
          var answer_question = "abdjfasdf";
          plaid.step(response.access_token, answer_question, function(err, response) {
            //response is accounts and transactions object
            console.log(response, err);
          })
        }
      });
    }

    /**
     * Get a user's transactions, using the access_token
     */
    // plaid.get(access_token, function(err, res) {
    //   console.log('Accounts : ', res.accounts);
    //   console.log('Transactions : ', res.transactions);
    // });
  });

  // THE REST
  app.get('/', function(req, res) {
    res.sendfile('./static/templates/index.html'); // load our public/index.html file
  });
};
