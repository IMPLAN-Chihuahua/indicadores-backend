"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const indicadores = [];
    for (let i = 0; i < 5; i++) {
      const codigo = "00" + (i + 1);
      const date = new Date();
      indicadores.push({
        id: i + 1,
        urlMapa: faker.internet.url(),
        urlImagen: faker.image.imageUrl(),
        nombre: "test " + i,
        codigo: codigo,
        codigoObjeto: codigo,
        ultimoValorDisponible: faker.random.number(),
        anioUltimoValorDisponible: i % 2 == 0 ? 2020 : 2019,
        coberturaGeografica: "No aplica",
        createdBy: 1,
        updatedBy: 1,
        idModulo: 1,
        idOds: i + 1,
        idCobertura: i + 1,
        idUnidadMedida: i + 1,
        createdAt: date,
        updatedAt: date,
        tendenciaActual: i % 2 == 0 ? "ASCENDENTE" : "DESCENDENTE",
      });
    }
    await queryInterface.bulkInsert("Indicadores", indicadores, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Indicadores", null, {});
  },
};
