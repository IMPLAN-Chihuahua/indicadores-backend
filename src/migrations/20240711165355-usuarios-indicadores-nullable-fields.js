'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('UsuarioIndicadores', 'fechaDesde', {
        type: Sequelize.DATEONLY,
        allowNull: true
      }),
      queryInterface.changeColumn('UsuarioIndicadores', 'fechaHasta', {
        type: Sequelize.DATEONLY,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('UsuarioIndicadores', 'fechaDesde', {
        type: Sequelize.DATEONLY,
        allowNull: false
      }),
      queryInterface.changeColumn('UsuarioIndicadores', 'fechaHasta', {
        type: Sequelize.DATEONLY,
        allowNull: false
      })
    ])
  }
};
