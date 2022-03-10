'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Indicadores',
        'activo', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'SI'
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Indicadores', 'activo')
    ]);
  }
};
