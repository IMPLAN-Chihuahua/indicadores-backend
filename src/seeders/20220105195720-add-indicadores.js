"use strict";
const faker = require("faker");
const { aCodigo, randomYear } = require("../utils/factories");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const indicadores = [];
    for (let i = 0; i < 10; i++) {
      const codigo = aCodigo();
      const date = new Date();
      indicadores.push({
        id: i + 1,
        urlImagen: faker.image.imageUrl(),
        nombre: `Test ${faker.random.word()}`,
        codigo,
        codigoObjeto: codigo,
        ultimoValorDisponible: faker.datatype.number(),
        anioUltimoValorDisponible: randomYear(),
        createdBy: 1,
        updatedBy: 1,
        idModulo: 1,
        createdAt: date,
        updatedAt: date,
        tendenciaActual: i % 2 === 0 ? "ASCENDENTE" : "DESCENDENTE",
        tendenciaDeseada: i % 2 === 0 ? "ASCENDENTE" : "DESCENDENTE",
        definicion: faker.lorem.sentence(),
      });
    }
    await queryInterface.bulkInsert("Indicadores", indicadores, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Indicadores", null, {});
  },
};
