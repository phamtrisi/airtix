var Sequelize = require('sequelize');
var db = require('../../config/db');

var sequelize = new Sequelize(db.connectionString);
var FORCE_CREATE_TABLE = false;

// CATEGORY
var Category = sequelize.define('category', {
      name: {
        type: Sequelize.STRING,
      }
    }, {
      freezeTableName: true
    });

Category
  .hasMany(Category, {
    as: 'subCategories'
  });
Category.sync({force: FORCE_CREATE_TABLE});





// ACCOUNTS
var Account = sequelize.define('account', {
      externalId: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      accountNumber: {
        type: Sequelize.STRING
      },
      limit: {
        type: Sequelize.FLOAT
      },
      available: {
        type: Sequelize.FLOAT
      },
      currentBalance: {
        type: Sequelize.FLOAT
      }
    }, {
      freezeTableName: true
    });

Account.sync({force: FORCE_CREATE_TABLE});





// VENDORS
var Vendor = sequelize.define('vendor', {
      name: {
        type: Sequelize.STRING
      }
    }, {
      freezeTableName: true
    });

Vendor.sync({force: FORCE_CREATE_TABLE});




// INSTITUTION ACCOUNTS
var InstitutionAccount = sequelize.define('institutionAccount', {
      institution: {
        type: Sequelize.STRING
      },
      accessToken: {
        type: Sequelize.STRING
      }
    }, {
      freezeTableName: true
    });

InstitutionAccount.sync({force: FORCE_CREATE_TABLE});





// TRANSACTIONS
var Transaction = sequelize.define('transaction', {
      dateTime: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      amount: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      description: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      }
    }, {
      freezeTableName: true
    });

Transaction.belongsTo(Account);
Transaction.belongsTo(Category);
Transaction.belongsTo(Vendor);
Transaction.sync({force: FORCE_CREATE_TABLE});



// Exports
module.exports = {
  sequelize: sequelize,
  Category: Category,
  Transaction: Transaction,
  Account: Account,
  Vendor: Vendor,
  InstitutionAccount: InstitutionAccount
};