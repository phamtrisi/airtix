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

    function processAccountsData(response) {
      var newAccounts = response.accounts;
      console.log("processing account");
      // Add this InstitutionAccount if not exist
      models.InstitutionAccount.create({
        username: data.username,
        institution: data.institutionType,
        accessToken: response.access_token
      }).then(function() {
        // Add all bank accounts associated with this InstitutionAccount if not existing
        newAccounts.forEach(function(account) {
          models.Account.findOrCreate({
            where: {
              accountNumber: account.meta.number
            },
            defaults: {
              name: account.meta.name,
              limit: parseFloat(account.meta.limit) || null,
              available: parseFloat(account.balance.available) || null,
              currentBalance: parseFloat(account.balance.current) || null,
            } 
          });
        });
      });
    }
    
    if (data) {
      // See if this account has already been added by checking username and institutionType
      models.InstitutionAccount.find({
        where: {
          username: data.username,
          institution: data.institutionType
        }
      }).then(function(existingInstitutionAccount) {
        if (existingInstitutionAccount) {
          return;
        }
        else {
          console.log('connecting to plaid');
          // Connect to Plaid
          plaid.connect({
            username: data.username,
            password: data.password
          }, data.institutionType, '', function(error, response, mfa) {

            //MFA
            if (mfa) {
              res.json(response);
              // var answer_question = "abdjfasdf";
              // plaid.step(response.access_token, answer_question, function(error, response) {
              //   processAccountsData(response);
              // })
            }
            else if (response && !error) {
              processAccountsData(response);
            }
            else if (error) {

            }
          });
        }
      });      
    }
  });

  // THE REST
  app.get('/', function(req, res) {
    res.sendfile('./static/templates/index.html'); // load our public/index.html file
  });
};
