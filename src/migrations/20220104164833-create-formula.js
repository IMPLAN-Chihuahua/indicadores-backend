'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Formulas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      ecuacion: {
        defaultValue: 'No aplica',
        type: Sequelize.STRING
      },

      descripcion: {
        defaultValue: 'No aplica',
        type: Sequelize.STRING
      },

      idIndicador: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Indicadores',
          id: 'id'
        }
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Formulas');
  }
};