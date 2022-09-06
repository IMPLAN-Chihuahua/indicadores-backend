'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Formulas', 'isFormula', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'SI'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Formulas', 'isFormula');
  }
};
