var sequelize = require('sequelize');

var Category = sequelize.define('category', {
      name: {
        type: Sequelize.STRING,
      },
    }, {
      freezeTableName: true // Model tableName will be the same as the model name
    });

module.exports = {
  category: Category
};



// User.sync({force: true}).then(function () {
//   // Table created
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
//   });
// });