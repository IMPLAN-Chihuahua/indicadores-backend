'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usuarios', 'requestedPasswordChange', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'NO'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usuarios', 'requestedPasswordChange');
  }
};
