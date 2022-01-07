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
      },
      idIndicador: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Indicadores',
          key: 'id'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ods');
  }
};