const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;

const UsuarioService = require('../services/usuariosService');
const faker = require('faker');

describe('Insert user', () => {
    it('should insert user without errors', async () => {
        const usuario = {
            nombres: faker.name.firstName(),
            apellidopaterno: faker.name.lastName(),
            correo: faker.internet.email(),
            clave: faker.internet.password(8, false)
        };
        const savedUsuario = await UsuarioService.addUsuario(usuario);
        console.log(savedUsuario);
        expect(savedUsuario).to.not.be.undefined();
    })
});