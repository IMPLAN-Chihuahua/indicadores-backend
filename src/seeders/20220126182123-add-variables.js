'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const variables = [];
    const variablesFromFormula = ['x', 'y', 'z'];
    const nombresFromFormula = ['Descripción de valor 1', 'Descripción de valor 2', 'Descripción de valor 3'];
    variables.push({
      id: (1),
      nombre: variablesFromFormula[0],
      codigoAtributo: '001',
      nombreAtributo: nombresFromFormula[0],
      dato: '123',
      anio: 2021,
      idUnidad: 1,
      idFormula: 1,
    });
    variables.push({
      id: (2),
      nombre: variablesFromFormula[1],
      codigoAtributo: '002',
      nombreAtributo: nombresFromFormula[1],
      dato: '123',
      anio: 2021,
      idUnidad: 1,
      idFormula: 1,
    });
    variables.push({
      id: (3),
      nombre: variablesFromFormula[2],
      codigoAtributo: '003',
      nombreAtributo: nombresFromFormula[2],
      dato: '123',
      anio: 2021,
      idUnidad: 1,
      idFormula: 1,
    })


    await queryInterface.bulkInsert('Variables', variables, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Variables', null, {});
  }
};
