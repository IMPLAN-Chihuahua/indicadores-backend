'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Indicadores', 'idCobertura', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Coberturas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Indicadores', 'idCobertura');
  }
};
