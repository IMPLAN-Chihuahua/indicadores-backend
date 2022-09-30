'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'UsuarioIndicadores',
        'expires', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'NO'
      }
      ),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UsuarioIndicadores', 'expires'),
    ]);
  }
};
