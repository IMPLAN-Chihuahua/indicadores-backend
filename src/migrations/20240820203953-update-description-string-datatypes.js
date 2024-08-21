'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Dimensions', 'descripcion', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'No aplica'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Dimensions', 'descripcion', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'No aplica'
    })
  }
};
