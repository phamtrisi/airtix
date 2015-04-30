module.exports = function(sequelize, DataTypes) {
  PriceLog = sequelize.import(__dirname + '/PriceLogModel.js')

  var PriceWatch =  sequelize.define('PriceWatch', {
    from_airport: {
      type: DataTypes.STRING,
      allowNull: false
    },
    to_airport: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE
    },
    name: DataTypes.STRING
  }, {
    freezeTableName: false,
    tableName: 'price_watches',
    underscored: true,
    instanceMethods: {
      priceHistory: function() {
        return;
      },
      lastPriceLog: function() {
        return 0;
      }
    }
  });

  // Set up relationships
  PriceWatch.hasMany(PriceLog);

  return PriceWatch;
}