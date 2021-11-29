const chai = require('chai');
const assert = chai.assert;

const UsuarioService = require('../../services/usuariosService');
const { Usuario } = require('../../models/usuario');
const faker = require('faker');


describe('Usuario CRUD operations', () => {

    const usuario = {
        nombres: faker.name.firstName(),
        apellidopaterno: faker.name.lastName(),
        correo: faker.internet.email(),
        clave: faker.internet.password(8, false)
    };

    before('insert mock user', async () => {
        await Usuario.create(usuario);
    });

    it('Should return first user', async () => {
        const existingUsuario = await UsuarioService.getUsuarioById(1);
        assert.isNotNull(existingUsuario, 'User with id 1');
    });

    after('clean usuarios table', async () => {
        await Usuario.destroy({
            where: {},
            truncate: true
        });
    });

    it('Should insert user without errors', async () => {
        usuario.correo = faker.internet.email();
        const savedUsuario = await UsuarioService.addUsuario(usuario);
        assert.isNotNull(savedUsuario, "usuario no es null");
    });

    it('Should raise an error if apellidopaterno field is missing', async () => {
        const badUsuario = {
            nombres: faker.name.firstName(),
            correo: faker.internet.email(),
            clave: faker.internet.password(8, false)
        };
        assert.isNotOk(badUsuario, 'is not ok');
    });





});