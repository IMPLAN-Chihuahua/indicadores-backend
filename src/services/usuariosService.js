const { Usuario } = require('../models');

const addUsuario = async (usuario) => {
    try {
        const { nombres,
            correo,
            apellidoPaterno,
            apellidoMaterno,
        } = await Usuario.create(usuario);
        return {
            nombres,
            correo,
            apellidoPaterno,
            apellidoMaterno,

        };
    } catch (err) {
        return Promise.reject(new Error(`Error al crear usuario ${err.message}`));
    }
};

const getUsuarioById = async (id) => {
    try {
        const usuario = await Usuario.findOne({
            where: { id },
            attributes: [
                'correo',
                'nombres',
                'apellidoPaterno',
                'apellidoMaterno',
                'activo',
                'avatar'
            ]
        });
        return usuario;
    } catch (err) {
        throw new Error('Error al buscar usuario por ID: ' + err.message);
    }
};

const getUsuarioByCorreo = async (correo) => {
    try {
        return await Usuario.findOne({ where: { correo: correo } });
    } catch (err) {
        throw (new Error('Error al buscar usuario por correo: ' + err.message));
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
};

const getUsuarios = async (limit = 25, offset = 0) => {
    try {
        const result = await Usuario.scope('withoutPassword')
            .findAndCountAll({ limit, offset });
        const usuarios = result.rows;
        const total = result.count;
        return { usuarios, total };
    } catch (err) {
        throw new Error('Error al obtener lista de usuarios: ' + err.message);
    }
};


// returns true if usuario was updated
const updateUsuario = async (id, { nombres, apellidoPaterno, apellidoMaterno, activo, avatar }) => {
    try {
        const affectedRows = await Usuario.update(
            { nombres, apellidoPaterno, apellidoMaterno, activo, avatar },
            { where: { id: id } });
        return affectedRows > 0;
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