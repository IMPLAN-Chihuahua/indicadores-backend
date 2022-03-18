'use strict';

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const catalogoDetails = [];
    for (let i = 0; i < 300; i++) {
      const idCatalogo = (i % 3) + 1;
      catalogoDetails.push({
        nombre: `${faker.random.word()}-${i}`,
        idUnidad: idCatalogo,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('CatalogoDetails', catalogoDetails, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CatalogoDetails', null, {});
  }
};
