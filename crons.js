var CronJob = require('cron').CronJob;
var db = require('./config/db'),
  creds = require('./config/creds');
var models = require('./app/models/models');
var plaid = require('plaid')({
  client_id: creds.plaid.client_id,
  secret: creds.plaid.secret
});


// Get transactions every 2 hours
var updateTransactions = new CronJob({
  cronTime: '0 0 * * * *',
  onTick: function() {
    console.log("Grabbing transactions");
    models.InstitutionAccount.findAll().then(function(institutionAccounts) {
      if (institutionAccounts && institutionAccounts.length) {
        institutionAccounts.forEach(function(insitutionAccount) {
          plaid.get(insitutionAccount.accessToken, function(err, res) {
            if (res && !err) {
              var bankAccounts = res.accounts,
                  transactions = res.transactions;

              transactions.forEach(function(transaction) {
                models.Transaction.findOrCreate({
                  where: {
                    externalId: transaction._id
                  },
                  defaults: {
                    amount: transaction.amount,
                    dateTime: new Date(transaction.date),
                    description: transaction.name,
                    meta: JSON.stringify(transaction.meta),
                    pending: transaction.pending
                  }
                });  
              });      
            }
            else if (error) {
              console.log('ERROR: ' + error);
            }
          });
        });
      }
      
    });
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});

updateTransactions.start();