'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Indicadores', 'idModulo', 'idTema');

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Indicadores', 'idTema', 'idModulo');
  }
};
