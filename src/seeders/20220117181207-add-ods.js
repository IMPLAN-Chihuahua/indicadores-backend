'use strict';
const faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ods = [];
    for (let i = 0; i < 10; i++) {
      ods.push(
        {
          id: (i + 1),
          nombre: faker.random.word()        
        });
  }
  await queryInterface.bulkInsert('Ods', ods, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Ods', null, {});
  }
}
