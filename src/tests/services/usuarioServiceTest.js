const chai = require('chai');
const assert = chai.assert;

const UsuarioService = require('../../services/usuariosService');
const faker = require('faker');

describe('Usuario insert test', () => {

    it('Should raise an error if any required field is missing', async() => {
        // TODO: test user service without some required fields and test error
    });


    it('Should insert user without errors', async () => {
        const usuario = {
            nombres: faker.name.firstName(),
            apellidopaterno: faker.name.lastName(),
            correo: faker.internet.email(),
            clave: faker.internet.password(8, false)
        };
        const savedUsuario = await UsuarioService.addUsuario(usuario);
        assert.isNotNull(savedUsuario, "usuario no es null");
        console.log(savedUsuario);
    });


});