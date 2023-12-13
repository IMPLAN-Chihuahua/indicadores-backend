'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Indicadores',
        'owner', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
      }
      ),
      queryInterface.removeColumn('Indicadores', 'codigoObjeto')
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Indicadores', 'owner'),
    ]);
  }
};
