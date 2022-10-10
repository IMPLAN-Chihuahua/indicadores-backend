'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Variables', 'nombreAtributo', 'descripcion');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Variables', 'descripcion', 'nombreAtributo');
  }
};
