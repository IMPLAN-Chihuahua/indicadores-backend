const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;
const faker = require('faker');
const UsuarioService = require('../../services/usuariosService');
const { Usuario } = require('../../models');

describe('Usuario CRUD operations', function () {

    const usuario = {
        nombres: faker.name.firstName(),
        apellidoPaterno: faker.name.lastName(),
        correo: faker.internet.email(),
        clave: faker.internet.password(8, false),
        idRol: 1
    };
    
    // hook to mock a user
    beforeEach('insert mock user', async function () {
        const saved = await Usuario.create(usuario);
        usuario.id = saved.id;
    });

    // hook to delete recors in usuarios table
    afterEach('clean usuarios table', async function () {
        await Usuario.truncate({ cascade: true });
    });


    // Read
    it('Should return a user with a given id', async function () {
        const existingUsuario = await UsuarioService.getUsuarioById(usuario.id);
        assert.exists(existingUsuario);
    });

    it('Should return a user with a given correo', async function () {
        const existingUsuario = await UsuarioService.getUsuarioByCorreo(usuario.correo);
        assert.exists(existingUsuario);
    });

    it('Should return null if user does not exist', async function () {
        const existingUsuario = await UsuarioService.getUsuarioById(0);
        assert.isNull(existingUsuario);
    });

    it('Should return a list of users', async function () {
        const { usuarios } = await UsuarioService.getUsuarios();
        assert.isAtMost(usuarios.length, 1);
    });

    it('Should assert correo is already in use', async function () {
        const alreadyUse = await UsuarioService.isCorreoAlreadyInUse(usuario.correo)
        assert.equal(alreadyUse, true);
    });


    // Create
    it('Should insert user without errors', async function () {
        usuario.correo = faker.internet.email();
        delete usuario.id;
        const savedUsuario = await UsuarioService.addUsuario(usuario);
        assert.isNotNull(savedUsuario);
    });

    it('Should raise an error if apellidoPaterno field is missing', async function () {
        const badUsuario = {
            nombres: faker.name.firstName(),
            correo: faker.internet.email(),
            clave: faker.internet.password(8, false)
        };
        assert.isRejected(UsuarioService.addUsuario(badUsuario));
    });


    // Update
    it('Should update update user\'s name', async function () {
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { nombres: faker.name.firstName() });
        assert.equal(1, affectedRows);
    });

    it('Should update update user\'s name and deactivate account', async function () {
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { nombres: faker.name.firstName(), activo: "NO" });
        assert.equal(1, affectedRows);
    });

    it('Should not affect any row with invalid fields', async function () {
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { aField: 'a value', anotherField: "some value" });
        assert.equal(0, affectedRows);
    });

    it('Should not update the id of a user', async function () {
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { id: 0 });
        assert.equal(0, affectedRows);
    });
});