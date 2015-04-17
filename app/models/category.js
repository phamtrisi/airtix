module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: false,
    tableName: 'categories'
  });

  Category.hasMany(Category, {
    as: 'subCategories'
  });
}