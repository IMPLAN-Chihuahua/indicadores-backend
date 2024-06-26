'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Dimensions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      titulo: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },

      descripcion: {
        allowNull: true,
        type: Sequelize.STRING
      },

      urlImagen: {
        allowNull: true,
        type: Sequelize.STRING
      },

      color: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: '#ffffff'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Dimensions');
  }
};