'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Historicos',
        'fechaIngreso', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      )])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Historicos', 'fechaIngreso'),
    ]);
  }
};
