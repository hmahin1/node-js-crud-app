'use strict';
module.exports = function(sequelize, DataTypes)  {
  var user = sequelize.define('user', {
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.INTEGER,  
  });

  user.associate = function (models) {
  };
    
    return user;
};