'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Modulos', 'descripcion', { type: Sequelize.STRING, allowNull: true, defaultValue: null })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Modulos', 'descripcion', {})
    ])
  }
};
