module.exports = function(sequelize, DataTypes) {
  var PriceLog =  sequelize.define('PriceLog', {
    price: {
      type: DataTypes.FLOAT
    }
  }, {
    freezeTableName: false,
    tableName: 'price_logs',
    underscored: true
  });

  return PriceLog;
}