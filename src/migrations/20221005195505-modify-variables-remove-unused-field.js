'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Variables', 'codigoAtributo')
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Indicadores', 'codigoAtributo', {
        allowNull: false,
        type: Sequelize.STRING
      })
    ]);
  }
};
