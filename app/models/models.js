var Sequelize = require('sequelize');
var db = require('../../config/db');

var sequelize = new Sequelize(db.connectionString);

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
Category.sync({force: false});





// ACCOUNTS
var Account = sequelize.define('account', {
      name: {
        type: Sequelize.STRING,
      }
    }, {
      freezeTableName: true
    });

Account.sync({force: false});





// VENDORS
var Vendor = sequelize.define('vendor', {
      name: {
        type: Sequelize.STRING
      }
    }, {
      freezeTableName: true
    });

Vendor.sync({force: false});





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
Transaction.sync({force: false});



// Exports
module.exports = {
  sequelize: sequelize,
  Category: Category,
  Transaction: Transaction
};