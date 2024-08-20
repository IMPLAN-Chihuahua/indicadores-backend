'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Indicadores', 'adornment', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Indicadores', 'adornment')
  }
};
