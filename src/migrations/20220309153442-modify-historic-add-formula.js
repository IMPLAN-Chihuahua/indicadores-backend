'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Historicos',
        'ecuacion', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'No aplica'
        },
      ),
      queryInterface.addColumn(
        'Historicos',
        'descripcionEcuacion', {
          type: Sequelize.STRING,
          defaultValue: 'No aplica'
        }
    )])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Historicos', 'ecuacion'),
      queryInterface.removeColumn('Historicos', 'descripcionEcuacion')
    ]);
  }
};
