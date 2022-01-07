'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Historicos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      valor: {
        allowNull: false,
        defaultValue: 'No aplica',
        type: Sequelize.STRING
      },
      
      anio: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },

      fuente: {
        allowNull: false,
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
    await queryInterface.dropTable('Historicos');
  }
};