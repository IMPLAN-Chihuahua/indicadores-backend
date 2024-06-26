"use strict";
const { aDimension } = require("../utils/factories");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dimensiones = [];
    for (let i = 1; i < 4; i++) {
      dimensiones.push(aDimension(i));
    }
    await queryInterface.bulkInsert("Dimensions", dimensiones, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Dimensions", null, {});
  },
};
