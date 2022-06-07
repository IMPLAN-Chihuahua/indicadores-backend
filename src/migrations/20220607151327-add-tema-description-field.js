'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Modulos', 'descripcion', { type: Sequelize.STRING, allowNull: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Modulos', 'descripcion', {});
  }
};
