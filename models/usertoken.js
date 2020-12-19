'use strict';
module.exports = (sequelize, DataTypes) => {
  var userToken = sequelize.define('user_token', {
    token: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    expire: DataTypes.BOOLEAN
  });

  userToken.associate = function (models) {
    userToken.belongsTo(sequelize.models.user, { foreignKey: 'user_id' });
  };
  
  return userToken;
};