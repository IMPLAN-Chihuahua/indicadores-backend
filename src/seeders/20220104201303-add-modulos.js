'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const modulos = [];
    for (let i = 0; i < 10; i++) {
      modulos.push(
        {
          id: (i + 1),
          temaIndicador: faker.random.word(),
          observaciones: faker.random.words(5),
          activo: i % 2 == 0 ? 'SI' : 'NO',
          codigo: ('00' + (i + 1)),
          createdAt: new Date(),
          updatedAt: new Date(),
          urlImagen: faker.image.imageUrl(),
          color: faker.commerce.color()
        }
      );
    }

    await queryInterface.bulkInsert('Modulos', modulos, {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Modulos', null, {});
  }
};
