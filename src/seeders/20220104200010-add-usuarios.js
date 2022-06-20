'use strict';
const faker = require('faker');
const { hashClave } = require('../middlewares/auth');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = [];
    usuarios.push({
      id: 13,
      correo: 'mike.281299@gmail.com',
      clave: await hashClave('chocolates'),
      nombres: 'Miguel',
      apellidoPaterno: 'Valdez',
      urlImagen: 'images/user/avatar.jpg',
      activo: 'SI',
      createdAt: new Date(),
      updatedAt: new Date(),
      idRol: 1,
      requestedPasswordChange: 'NO',
      descripcion: 'Holaaaaaaaaa, no tengo nada qué decir',
    });

    // for (let i = 0; i < 10; i++) {
    //   const firstName = faker.name.firstName();
    //   const lastName = faker.name.lastName();
    //   usuarios.push({
    //     correo: faker.internet.email(firstName, lastName),
    //     clave: faker.internet.password(),
    //     nombres: `${firstName} ${lastName}`,
    //     apellidoPaterno: firstName,
    //     apellidoMaterno: lastName,
    //     urlImagen: faker.internet.avatar(),
    //     activo: i % 2 === 0 ? 'SI' : 'NO',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     idRol: (i % 2) + 1
    //   });
    // }
    await queryInterface.bulkInsert('Usuarios', usuarios, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
