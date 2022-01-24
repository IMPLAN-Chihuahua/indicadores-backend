"use strict";
const faker = require("faker");
module.exports = {
  async up(queryInterface, Sequelize) {
    const historico = [];

    for (let i = 0; i < 10; i++) {
      const date = new Date();
      historico.push({
        id: i + 1,
        valor: faker.random.number(),
        anio: 2022 - i,
        fuente: faker.internet.url(),
        idIndicador: 1,
        createdAt: date,
      });
    }
    await queryInterface.bulkInsert("Historicos", historico, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Historicos", null, {});
  },
};
