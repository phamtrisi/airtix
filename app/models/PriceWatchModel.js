module.exports = function(sequelize, DataTypes) {
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
    underscored: true
  });

  return PriceWatch;
}