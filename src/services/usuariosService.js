const { Usuario } = require('../models/usuario');

const addUsuario = async (usuario) => {
    try {
        const savedUser = await Usuario.create(usuario);
        return savedUser;
    } catch (err) {
        throw new Error('Error al crear usuario\n  ' + err.message);
    }
};

const getUsuarioById = async (id) => {
    try {
        const usuario = await Usuario.findOne({ where: { id: id } });
        return usuario;
    } catch (err) {
        throw new Error('Error al buscar usuario por Id\n  ' + err.message);
    }
};

const getUsuarioByCorreo = async (correo) => {
    try {
        return await Usuario.findOne({ where: { correo: correo } });
    } catch (err) {
        throw new Error('Error al buscar usuario por correo\n  ' + err.message);
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
        throw new Error('Error al buscar si correo ha sido utilizado\n  ' + err.message);
    }
};

const getUsuarios = async (limit = 25, offset = 0) => {
    try {
        const usuarios = Usuario.scope('withoutPassword').findAndCountAll({ limit: limit, offset: offset });
        return usuarios;
    } catch (err) {
        throw new Error('Error al obtener lista de usuarios\n  ' + err.message);
    }
};

module.exports = {
    addUsuario,
    getUsuarioById,
    getUsuarioByCorreo,
    getUsuarios,
    isCorreoAlreadyInUse
}