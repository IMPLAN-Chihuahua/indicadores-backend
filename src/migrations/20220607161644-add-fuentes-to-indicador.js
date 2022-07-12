'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Indicadores', 'fuente', { type: Sequelize.STRING(1000), allowNull: true })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Indicadores', 'fuente', {})
    ])
  }
};
