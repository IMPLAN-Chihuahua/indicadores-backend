'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Indicadors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING
      },
      definicion: {
        allowNull: false,
        defaultValue: 'No aplica',
        type: Sequelize.STRING
      },
      codigo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      codigoObjeto: {
        allowNull: false,
        type: Sequelize.STRING
      },
      anioUltimoValorDisponible: {
        allowNull: false,
        type: Sequelize.STRING
      },
      unidadMedida: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'No aplica'
      },
      coberturaGeografica: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tendenciaActual: {
        allowNull: false,
        defaultValue: 'No aplica',
        type: Sequelize.STRING
      },
      tendenciaDeseada: {
        allowNull: false,
        defaultValue: 'No aplica',
        type: Sequelize.STRING
      },
      mapa: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.SMALLINT
      },
      grafica: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.SMALLINT
      },
      observaciones: {
        type: Sequelize.STRING
      },
      creadorId: {
        type: Sequelize.INTEGER
      },
      editorId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Indicadors');
  }
};