'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Variables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      nombre: {
        allowNull: false,
        type: Sequelize.STRING
      },

      codigoAtributo: {
        allowNull: false,
        type: Sequelize.STRING
      },

      nombreAtributo: {
        allowNull: false,
        type: Sequelize.STRING
      },

      formulaCalculo: {
        allowNull: false,
        type: Sequelize.STRING
      },

      datoVariable: {
        allowNull: true,
        type: Sequelize.STRING
      },

      unidad: {
        allowNull: false,
        type: Sequelize.STRING
      },

      anio: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      
      idFormula: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Formulas',
          key: 'id'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Variables');
  }
};