'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Indicadores', 'idOds', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Ods',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Indicadores', 'idOds');

  }
};
