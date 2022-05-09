'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Usuarios',
        'descripcion', {
        type: Sequelize.STRING,
        defaultValue: 'Usuario de sistema de indicadores'
      },
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Usuarios', 'descripcion')
    ])
  }
};
