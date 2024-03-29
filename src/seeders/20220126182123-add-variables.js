'use strict';

const { randomYear } = require("../utils/factories");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const variables = [];
    const variablesFromFormula = ['x', 'y', 'z'];
    const nombresFromFormula = ['Descripción de valor 1', 'Descripción de valor 2', 'Descripción de valor 3'];
    variables.push({
      nombre: variablesFromFormula[0],
      descripcion: nombresFromFormula[0],
      dato: '123',
      anio: randomYear(),
      idUnidad: 2,
      idFormula: 1,
    });
    variables.push({
      nombre: variablesFromFormula[1],
      descripcion: nombresFromFormula[1],
      dato: '123',
      anio: randomYear(),
      idUnidad: 5,
      idFormula: 1,
    });
    variables.push({
      nombre: variablesFromFormula[2],
      descripcion: nombresFromFormula[2],
      dato: '123',
      anio: randomYear(),
      idUnidad: 8,
      idFormula: 1,
    })


    await queryInterface.bulkInsert('Variables', variables, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Variables', null, {});
  }
};
