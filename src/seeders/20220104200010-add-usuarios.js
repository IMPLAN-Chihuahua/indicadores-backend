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
    const usuarios = [];
    for (let i = 0; i < 10; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      usuarios.push({
        correo: faker.internet.email(firstName, lastName),
        clave: faker.internet.password(),
        nombres: firstName + ' ' + lastName,
        apellidoPaterno: firstName,
        apellidoMaterno: lastName,
        avatar: faker.internet.avatar(),
        activo: i % 2 == 0 ? 'SI' : 'NO',
        createdAt: new Date(),
        updatedAt: new Date(),
        idRol: 1
      });
    }
    await queryInterface.bulkInsert('Usuarios', usuarios, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
