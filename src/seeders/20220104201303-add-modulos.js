'use strict';
const faker = require('faker');
const { aCodigo } = require('../utils/factories');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const temas = [];
    for (let i = 0; i < 20; i++) {
      temas.push(
        {
          temaIndicador: faker.random.word() + (i + 100),
          observaciones: faker.random.words(5),
          activo: i % 2 === 0 ? 'SI' : 'NO',
          codigo: aCodigo(),
          descripcion: faker.random.words(10),
          createdAt: new Date(),
          updatedAt: new Date(),
          urlImagen: faker.image.imageUrl(),
          color: faker.commerce.color()
        }
      );
    }

    await queryInterface.bulkInsert('Temas', temas, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Temas', null, {});
  }
};
