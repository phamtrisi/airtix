var Sequelize = require('sequelize');
var db = require('../../config/db');
var sequelize = new Sequelize(db.connectionString);

var Category = sequelize.define('category', {
      name: {
        type: Sequelize.STRING,
      },
    }, {
      freezeTableName: true // Model tableName will be the same as the model name
    });

module.exports = {
  Category: Category
};