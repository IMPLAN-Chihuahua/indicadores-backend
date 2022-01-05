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
    for (let i = 0; i < 1; i++) {
      modulos.push(
        {
          id: (i + 1),
          temaIndicador: faker.random.word(),
          observaciones: faker.random.words(5),
          activo: i % 2 == 0 ? 'SI' : 'NO',
          codigo: ('00' + (i + 1)),
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
