module.exports = function(sequelize, DataTypes) {
  var SavedWatch =  sequelize.define('SavedWatch', {
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
    tableName: 'saved_watches',
    underscored: true
  });

  return SavedWatch;
}