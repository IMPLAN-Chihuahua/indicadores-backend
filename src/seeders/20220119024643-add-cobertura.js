'use strict';
const faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const coberturas = [];
    for (let i = 0; i < 5; i++) {
      coberturas.push({
        id: i + 1,
        nombre: faker.random.word()
      });
    }
    await queryInterface.bulkInsert('CoberturaGeograficas', coberturas, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CoberturaGeograficas', null, {});
  }
};
