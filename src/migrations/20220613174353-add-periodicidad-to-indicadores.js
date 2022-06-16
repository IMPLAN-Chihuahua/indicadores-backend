'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Indicadores', 'periodicidad', {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: null,
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Indicadores', 'periodicidad', {})
    ])
  }
};
