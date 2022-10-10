'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Mapas',
        'urlImagen', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Mapas', 'urlImagen')
    ]);
  }
};
