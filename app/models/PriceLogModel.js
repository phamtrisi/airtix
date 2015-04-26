module.exports = function(sequelize, DataTypes) {
  var PriceLog =  sequelize.define('PriceLog', {
    lowest_business_price: {
      type: DataTypes.FLOAT
    },
    lowest_anytime_price: {
      type: DataTypes.FLOAT
    },
    lowest_get_away_price: {
      type: DataTypes.FLOAT
    }
  }, {
    freezeTableName: false,
    tableName: 'price_logs',
    underscored: true
  });

  return PriceLog;
}