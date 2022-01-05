'use strict';
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const indicadores = [];
    for (let i = 0; i < 30; i++) {
      const codigo = '00' + (i + 1);
      const date = new Date();
      indicadores.push({
        id: i,
        url: faker.internet.url(),
        nombre: faker.random.words(3),
        codigo: codigo,
        codigoObjeto: codigo,
        anioUltimoValorDisponible: (2015 + i),
        coberturaGeografica: 'No aplica',
        createdBy: 1,
        updatedBy: 1,
        idModulo: 1,
        createdAt: date,
        updatedAt: date
      });
    }
    await queryInterface.bulkInsert('Indicadores', indicadores, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Indicadores', null, {});
  }
};
