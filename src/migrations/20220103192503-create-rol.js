'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      rol: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
      },

      descripcion: {
        allowNull: true,
        type: Sequelize.STRING
      },

      activo: {
        allowNull: false,
        defaultValue: 'SI',
        type: Sequelize.STRING(2)
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Roles');
  }
};