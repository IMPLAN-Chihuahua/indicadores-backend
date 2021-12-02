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
        return await Usuario.findOne(
            {
                where: { correo: correo }
            });
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
        const usuarios = Usuario.scope('withoutPassword')
            .findAndCountAll({ limit: limit, offset: offset });
        return usuarios;
    } catch (err) {
        console.log(err);
        throw new Error('Error al obtener lista de usuarios: ' + err.message);
    }
};

const updateUsuario = async (id, fields) => {
    try {
        const updatedUser = await Usuario.update(
            { ...fields },
            { where: { id: id } });
        return updatedUser[0];
    } catch (err) {
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