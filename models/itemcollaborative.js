'use strict';
module.exports = (sequelize, DataTypes) => {
  var ItemCollaborative = sequelize.define('item_collaborative', {
    user_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    status: DataTypes.STRING,
    name: DataTypes.STRING
  });
  ItemCollaborative.associate = function (models) {
    ItemCollaborative.belongsTo(sequelize.models.user, { foreignKey: 'user_id' });
  };
return ItemCollaborative;
};
 