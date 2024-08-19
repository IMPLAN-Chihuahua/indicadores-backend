'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** add summary and alias columns */

    await queryInterface.addColumn('Dimensions', 'alias', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Dimensions', 'summary', {
      type: Sequelize.TEXT,
      allowNull: true
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Dimensions', 'alias');
    await queryInterface.removeColumn('Dimensions', 'summary');
  }
};
