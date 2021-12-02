const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;
const faker = require('faker');

const UsuarioService = require('../../services/usuariosService');
const { Usuario } = require('../../models/usuario');

describe('Usuario CRUD operations', () => {

    const usuario = {
        nombres: faker.name.firstName(),
        apellidopaterno: faker.name.lastName(),
        correo: faker.internet.email(),
        clave: faker.internet.password(8, false)
    };

    // hook to mock a user
    beforeEach('insert mock user', async () => {
        const saved = await Usuario.create(usuario);
        usuario.id = saved.id;
    });

    // hook to delete recors in usuarios table
    afterEach('clean usuarios table', async () => {
        await Usuario.destroy({
            truncate: true
        });
    });


    // Read
    it('Should return a user with a given id', async () => {
        const existingUsuario = await UsuarioService.getUsuarioById(usuario.id);
        assert.exists(existingUsuario);
    });

    it('Should return a user with a given correo', async () => {
        const existingUsuario = await UsuarioService.getUsuarioByCorreo(usuario.correo);
        assert.exists(existingUsuario);
    });

    it('Should return null if user does not exist', async () => {
        const existingUsuario = await UsuarioService.getUsuarioById(0);
        assert.isNull(existingUsuario);
    });

    it('Should return a list of users', async () => {
        const { usuarios } = await UsuarioService.getUsuarios();
        assert.isAtMost(usuarios.length, 1);
    });

    it('Should assert correo is already in use', async () => {
        const alreadyUse = await UsuarioService.isCorreoAlreadyInUse(usuario.correo)
        assert.equal(alreadyUse, true);
    });


    // Create
    it('Should insert user without errors', async () => {
        usuario.correo = faker.internet.email();
        delete usuario.id;
        const savedUsuario = await UsuarioService.addUsuario(usuario);
        assert.isNotNull(savedUsuario);
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
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { nombres: faker.name.firstName() });
        assert.equal(1, affectedRows);
    });

    it('Should update update user\'s name and deactivate account', async () => {
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { nombres: faker.name.firstName(), activo: "NO" });
        assert.equal(1, affectedRows);
    });

    it('Should not affect any row with invalid fields', async () => {
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { aField: 'a value', anotherField: "some value" });
        assert.equal(0, affectedRows);
    });

    it('Should not update the id of a user', async () => {
        const affectedRows = await UsuarioService.updateUsuario(usuario.id,
            { id: 0 });
        assert.equal(0, affectedRows);
    });
});