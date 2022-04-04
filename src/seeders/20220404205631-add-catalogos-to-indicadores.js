'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const associations = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 3; j++) {
        associations.push({
          idIndicador: i + 1,
          idCatalogoDetail: j + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    await queryInterface.bulkInsert('CatalogoDetailIndicadores', associations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CatalogoDetailIndicadores', null, {});
  }
};
