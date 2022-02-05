'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mapas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      ubicacion: {
        allowNull: false,
        type: Sequelize.STRING
      },

      url: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: 'No aplica'
      },
      
      idIndicador: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Indicadores',
          key: 'id'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Mapas');
  }
};