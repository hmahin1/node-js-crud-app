'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: false
      },

      token: {
        type: Sequelize.STRING
      },
      expire: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
      
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_tokens');
  }
};