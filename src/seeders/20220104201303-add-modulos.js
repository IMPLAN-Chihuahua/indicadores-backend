'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const modulos = [];
    for (let i = 0; i < 5; i++) {
      modulos.push(
        {
          temaIndicador: faker.random.word(),
          observaciones: faker.random.words(5),
          activo: i % 2 == 0 ? 'SI' : 'NO',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }

    await queryInterface.bulkInsert('Modulos', modulos, {});
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
