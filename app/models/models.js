var Sequelize = require('sequelize');
var db = require('../../config/db');

// Init the connection to db
var sequelize = new Sequelize(db.dev.connectionString);
var FORCE_CREATE_TABLE = false;

// Import models
var PriceWatch = sequelize.import(__dirname + '/PriceWatchModel.js'),
    PriceLog = sequelize.import(__dirname + '/PriceLogModel.js');

// Set up relationships
PriceLog.belongsTo(PriceWatch);

// Sync models
sequelize.sync({
  force: FORCE_CREATE_TABLE
});


// Exports
module.exports = {
  sequelize: sequelize,
  PriceWatch: PriceWatch,
  PriceLog: PriceLog
};
