'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Historicos',
        'pushedBy', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }
      ),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Historicos', 'pushedBy'),
    ]);
  }
};
