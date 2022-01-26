'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const variables = [];
    const variablesFromFormula = ['x', 'y', 'z'];
    const nombresFromFormula = ['Descripción de valor 1', 'Descripción de valor 2', 'Descripción de valor 3'];
    for (let i = 0; i < 2; i++) {
    variables.push({
      id: i + 1,
      nombre: variablesFromFormula[i],
      codigoAtributo: '001',
      nombreAttributo: nombresFromFormula[i],
      dato: '123',
      anio: 2021,
      idUnidad: 1,
      idFormula: 1,
    })
  }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
