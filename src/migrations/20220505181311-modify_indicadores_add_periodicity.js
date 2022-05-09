'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Indicadores',
        'periodicidad', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 12,
      }
      )
    ])
  },


  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Indicadores', 'periodicidad')
    ]);
  }
};
