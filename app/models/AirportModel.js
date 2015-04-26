module.exports = function(sequelize, DataTypes) {
  var Airport =  sequelize.define('Airport', {
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING
    },
    country: DataTypes.STRING
  }, {
    freezeTableName: false,
    tableName: 'airports',
    underscored: true
  });

  return Airport;
}