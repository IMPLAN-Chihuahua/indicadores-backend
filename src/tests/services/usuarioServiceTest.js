const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;
const expect = chai.expect;

const UsuarioService = require('../../services/usuariosService');
const { Usuario } = require('../../models/usuario');
const faker = require('faker');
const { ValidationError } = require('sequelize');


describe('Usuario CRUD operations', () => {

    const usuario = {
        nombres: faker.name.firstName(),
        apellidopaterno: faker.name.lastName(),
        correo: faker.internet.email(),
        clave: faker.internet.password(8, false)
    };

    // hooks to mock users and clean usuarios table
    beforeEach('insert mock user', async () => {
        const saved = await Usuario.create(usuario);
        usuario.id = saved.id;
    });

    afterEach('clean usuarios table', async () => {
        await Usuario.destroy({
            truncate: true
        });
    });


    // Read
    it('Should return a user with a given id', async () => {
        const existingUsuario = await UsuarioService.getUsuarioById(usuario.id);
        assert.exists(existingUsuario, 'User with id ' + usuario.id);
    });

    it('Should return a user with a given correo', async () => {
        const existingUsuario = await UsuarioService.getUsuarioByCorreo(usuario.correo);
        assert.exists(existingUsuario, 'User with correo');
    });

    it('Should return null if user does not exist', async () => {
        const existingUsuario = await UsuarioService.getUsuarioById(0);
        assert.isNull(existingUsuario, 'User with id ');
    });

    it('Should return a list of users', async () => {
        const usuarios = await UsuarioService.getUsuarios();
        assert.equal(usuarios.count, 1, 'array with one user');
    });

    it('Should assert correo is already in use', async () => {
        const alreadyUse = await UsuarioService.isCorreoAlreadyInUse(usuario.correo)
        assert.equal(alreadyUse, true, 'correo ocupado');
    });
    

    // Create
    it('Should insert user without errors', async () => {
        usuario.correo = faker.internet.email();
        delete usuario.id;
        const savedUsuario = await UsuarioService.addUsuario(usuario);
        assert.isNotNull(savedUsuario, "usuario no es null");
    });

    it('Should raise an error if apellidopaterno field is missing', async () => {
        const badUsuario = {
            nombres: faker.name.firstName(),
            correo: faker.internet.email(),
            clave: faker.internet.password(8, false)
        };
        assert.isRejected(UsuarioService.addUsuario(badUsuario));
    });


    // Update
    it('Should update update user\'s name', async () => {
        const updated = await UsuarioService.updateUsuario();
        assert.notEqual(usuario.name, updated.name);
    });

    // TODO: Delete

});