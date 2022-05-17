'use strict';
const faker = require('faker');
const { hashClave } = require('../middlewares/auth');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = [];
    usuarios.push({
      correo: 'johndoe@email.com',
      clave: await hashClave('password'),
      nombres: 'John',
      apellidoPaterno: 'Doe',
      descripcion: 'Usuario de sistema de indicadores',
      activo: 'SI',
      createdAt: new Date(),
      updatedAt: new Date(),
      idRol: 1
    });

    for (let i = 0; i < 10; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      usuarios.push({
        correo: faker.internet.email(firstName, lastName),
        clave: faker.internet.password(),
        nombres: `${firstName} ${lastName}`,
        apellidoPaterno: firstName,
        apellidoMaterno: lastName,
        descripcion: faker.lorem.words(5),
        urlImagen: faker.internet.avatar(),
        activo: i % 2 === 0 ? 'SI' : 'NO',
        createdAt: new Date(),
        updatedAt: new Date(),
        idRol: (i % 2) + 1
      });
    }
    await queryInterface.bulkInsert('Usuarios', usuarios, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
