'use strict';
const faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const unidades = [];
    for (let i = 0; i < 5; i++) {
      unidades.push({
        id: i + 1,
        nombre: faker.random.word()
      });
    }
    await queryInterface.bulkInsert('UnidadMedidas', unidades, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UnidadMedidas', null, {});
  }
};
