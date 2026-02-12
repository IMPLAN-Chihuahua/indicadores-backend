'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Indicadores', 'meses', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
      defaultValue: [1],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Indicadores', 'meses');
  }
};