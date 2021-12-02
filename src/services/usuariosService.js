const { Usuario } = require('../models/usuario');

const addUsuario = async (usuario) => {
    try {
        const { nombres,
            correo,
            apellidopaterno,
            apellidomaterno,
            fechacreacion } = await Usuario.create(usuario);
        return {
            nombres,
            correo,
            apellidopaterno,
            apellidomaterno,
            fechacreacion
        };
    } catch (err) {
        console.log(err);
        throw new Error(`Error al crear usuario ${err.message}`);
    }
};

const getUsuarioById = async (id) => {
    try {
        const usuario = await Usuario.scope('withoutPassword').findOne({ where: { id: id } });
        return usuario;
    } catch (err) {
        console.log(err);
        throw new Error('Error al buscar usuario por ID: ' + err.message);
    }
};

const getUsuarioByCorreo = async (correo) => {
    try {
        return await Usuario.findOne({ where: { correo: correo } });
    } catch (err) {
        console.log(err);
        throw new Error('Error al buscar usuario por correo: ' + err.message);
    }
};

const isCorreoAlreadyInUse = async (correo) => {
    try {
        const existingCorreo = await Usuario.findOne({
            attributes: ['correo'],
            where: { correo: correo }
        });
        return existingCorreo != null;
    } catch (err) {
        console.log(err);
        throw new Error('Error al buscar si correo ha sido utilizado: ' + err.message);
    }
};

const getUsuarios = async (limit = 25, offset = 0) => {
    try {
        const result = await Usuario.scope('withoutPassword')
            .findAndCountAll({ limit: limit, offset: offset });
        const usuarios = result.rows;
        const total = result.count;
        return { usuarios, total };
    } catch (err) {
        console.log(err);
        throw new Error('Error al obtener lista de usuarios: ' + err.message);
    }
};


// returns true if usuario was updated
const updateUsuario = async (id, { nombres, apellidopaterno, apellidomaterno, activo, avatar }) => {
    try {
        const affectedRows = await Usuario.update(
            { nombres, apellidopaterno, apellidomaterno, activo, avatar },
            { where: { id: id } });
        return affectedRows > 0;
    } catch (err) {
        console.log(err);
        throw new Error('Error al actualizar usuario: ' + err.message);
    }
};


module.exports = {
    addUsuario,
    getUsuarioById,
    getUsuarioByCorreo,
    getUsuarios,
    isCorreoAlreadyInUse,
    updateUsuario
}