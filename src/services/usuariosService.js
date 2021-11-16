// TODO: Add operations that call table Usuario here

const { Usuario } = require('../models/usuario');

const addUsuario = async (usuario) => {
    try {
        await Usuario.create(usuario);
    } catch (err) {
        console.log(err);
        throw new Error('Error al crear usuario: ' + err.message);
    }
};

const getUsuarioById = async (id) => {
    try {
        const usuario = await Usuario.findOne({ where: { id: id } });
        return usuario;
    } catch (err) {
        throw new Error('Error al buscar usuario por Id: ' + err.message);
    }
};

const getUsuarioByCorreo = async (correo) => {
    try {
        return await Usuario.findOne({ where: { correo: correo } });
    } catch (err) {
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
        throw new Error('Error al buscar si correo ha sido utilizado: ' + err.message);
    }
}

module.exports = {
    addUsuario,
    getUsuarioById,
    getUsuarioByCorreo,
    isCorreoAlreadyInUse
}