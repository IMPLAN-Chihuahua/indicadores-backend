'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date();
    const formula = [{
      id: 1,
      ecuacion: 'Z=x^2 + y^2',
      descripcion: 'Ecuación estándar que sirve para calcular el resultado de la suma de dos números reales equivalentes a algo',
      idIndicador: 1,
      createdAt: date,
      updatedAt: date,
    }];
    await queryInterface.bulkInsert('Formulas', formula, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Formulas', null, {});
  }
};
