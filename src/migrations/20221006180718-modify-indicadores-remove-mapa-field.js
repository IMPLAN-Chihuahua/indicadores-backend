'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Indicadores', 'mapa')
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Indicadores',
        'mapa', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      )
    ])
  }
};
