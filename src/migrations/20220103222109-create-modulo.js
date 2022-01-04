'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Modulos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      temaIndicador: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },

      observaciones: {
        allowNull: true,
        type: Sequelize.STRING
      },

      activo: {
        allowNull: true,
        defaultValue: 'SI',
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Modulos');
  }
};