'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: true,
        defaultValue: 'No aplica',
        type: Sequelize.STRING
<<<<<<< HEAD
      }
=======
      },
>>>>>>> feat-website-indicadores
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ods');
  }
};