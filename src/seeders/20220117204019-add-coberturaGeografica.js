'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const coberturaGeografica = [];
    for (let i = 0; i < 10; i++) {
      coberturaGeografica.push(
        {
          id: (i + 1),
          nombre: faker.random.word(),
          idIndicador: 1
        }
      );
    }
    await queryInterface.bulkInsert('CoberturaGeograficas', coberturaGeografica, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CoberturaGeograficas', null, {});
  }
};
