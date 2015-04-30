var Sequelize = require('sequelize');
var db = require('../../config/db');

// Init the connection to db
var sequelize = new Sequelize(db.prod.connectionString);
var FORCE_CREATE_TABLE = false;

// Import models
var PriceWatch = sequelize.import(__dirname + '/PriceWatchModel.js'),
    PriceLog = sequelize.import(__dirname + '/PriceLogModel.js'),
    Airport = sequelize.import(__dirname + '/AirportModel.js');

// Sync models
sequelize.sync({
  force: FORCE_CREATE_TABLE
});


// Exports
module.exports = {
  sequelize: sequelize,
  PriceWatch: PriceWatch,
  PriceLog: PriceLog,
  Airport: Airport
};
