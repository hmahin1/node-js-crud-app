'use strict';
module.exports = (sequelize, DataTypes) => {
  var PasswordReset = sequelize.define('password_reset', {
    user_id: DataTypes.INTEGER,
    code: DataTypes.INTEGER,
    status: DataTypes.STRING
  });
  PasswordReset.associate = function (models) {
    //PasswordReset.belongsTo(sequelize.models.user, { foreignKey: 'user_id' });
  };
return PasswordReset;
};
 