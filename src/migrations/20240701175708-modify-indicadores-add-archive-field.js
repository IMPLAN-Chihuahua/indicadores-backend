'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Indicadores',
        'archive', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
      ),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Indicadores', 'archive'),
    ]);
  }
};
