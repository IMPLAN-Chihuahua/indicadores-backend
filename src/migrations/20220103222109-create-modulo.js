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

      codigo: {
        allowNull: false,
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
      },

      imageUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },

      color: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: '#B376B8',
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Modulos');
  }
};