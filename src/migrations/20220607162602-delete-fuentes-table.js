'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Fuentes');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Fuentes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bibliografia: {
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
    }
    );
  }
};
