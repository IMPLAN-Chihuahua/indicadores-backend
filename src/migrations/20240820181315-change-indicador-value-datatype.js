'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Indicadores', 'ultimoValorDisponible', {
      type: 'DOUBLE PRECISION USING CAST("ultimoValorDisponible" AS DOUBLE PRECISION)',
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Indicadores', 'ultimoValorDisponible', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    })
  }
};
