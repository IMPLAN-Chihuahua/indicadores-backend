'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const catalogos = [];
    catalogos.push({
      nombre: 'ODS',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    catalogos.push({
      nombre: 'Unidad Medida',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    catalogos.push({
      nombre: 'Cobertura Geografica',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await queryInterface.bulkInsert('Catalogos', catalogos, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Catalogos', null, {});
  }
};
