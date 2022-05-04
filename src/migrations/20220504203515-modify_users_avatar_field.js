'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Usuarios', 'avatar', 'urlImagen');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Usuarios', 'urlImagen', 'avatar');
  }
};
