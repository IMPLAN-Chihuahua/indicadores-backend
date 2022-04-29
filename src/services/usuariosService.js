const { Usuario, Rol, Indicador, Sequelize, sequelize } = require('../models');

const { Op } = Sequelize;

const addUsuario = async (usuario) => {
    try {
        const { nombres,
            correo,
            apellidoPaterno,
            apellidoMaterno,
            activo
        } = await Usuario.create(usuario);
        return {
            nombres,
            correo,
            apellidoPaterno,
            apellidoMaterno,
            activo
        };
    } catch (err) {
        throw new Error(`Error al crear usuario ${err.message}`);
    }
};

const getUsuarioById = async (id) => {
    try {
        const usuario = await Usuario.findOne({
            where: { id },
            attributes: [
                'id',
                'correo',
                'nombres',
                'apellidoPaterno',
                'apellidoMaterno',
                'descripcion',
                'activo',
                'avatar',
                'requestedPasswordChange',
                [sequelize.literal('"rol"."id"'), "idRol"],
                [sequelize.literal('"rol"."rol"'), "roles"],
                [sequelize.literal('"rol"."activo"'), "activo"],
            ],
            include: [{
                model: Rol,
                attributes: [],
            }],
        });
        return usuario;
    } catch (err) {
        throw new Error(`Error al buscar usuario por ID: ${err.message}`);
    }
};

const getUsuarioByCorreo = async (correo) => {
    try {
        const usuario = await Usuario.findOne({ where: { correo } });
        return usuario;
    } catch (err) {
        throw (new Error(`Error al buscar usuario por correo: ${err.message}`));
    }
};

const isCorreoAlreadyInUse = async (correo) => {
    try {
        const existingCorreo = await Usuario.findOne({
            attributes: ['correo'],
            where: { correo }
        });
        return existingCorreo !== null;
    } catch (err) {
        throw new Error(`Error al buscar si correo ha sido utilizado: ${err.message}`);
    }
};

const addSearchQueryIfPresent = (searchQuery) => {
    if (searchQuery && searchQuery !== '') {
        return {
            [Op.or]: [
                { nombres: { [Op.iLike]: `%${searchQuery}%` } },
                { apellidoPaterno: { [Op.iLike]: `%${searchQuery}%` } },
                { apellidoMaterno: { [Op.iLike]: `%${searchQuery}%` } },
                { correo: { [Op.iLike]: `%${searchQuery}%` } },
            ]
        };
    }
}

const getUsuarios = async (limit, offset, searchQuery) => {
    try {
        const result = await Usuario.scope('withoutPassword').findAndCountAll({
            limit,
            offset,
            where: { ...addSearchQueryIfPresent(searchQuery) },
            order: [['updatedAt', 'DESC']]
        });
        const usuarios = result.rows;
        const total = result.count;
        return { usuarios, total };
    } catch (err) {
        throw new Error(`Error al obtener lista de usuarios: ${err.message}`);
    }
};

const countInactiveUsers = async () => {
    try {
        const inactiveCount = await Usuario.count({ where: { activo: 'NO' } });
        return inactiveCount;
    } catch (err) {
        throw new Error(`Error al contar usuarios inactivos ${err.message}`);
    }
}

// returns true if usuario was updated
const updateUsuario = async (id, { nombres, apellidoPaterno, apellidoMaterno, activo, avatar }) => {
    try {
        const affectedRows = await Usuario.update(
            { nombres, apellidoPaterno, apellidoMaterno, activo, avatar },
            { where: { id: id } });
        return affectedRows > 0;
    } catch (err) {
        throw new Error(`Error al actualizar usuario: ${err.message}`);
    }
};


const getRol = async (id) => {
    try {
        const { rolValue: rol } = await Usuario.findOne({
            where: { id },
            include: [
                {
                    model: Rol,
                    required: true,
                    attributes: []
                }
            ],
            attributes: [[Sequelize.literal('"rol"."rol"'), 'rolValue']],
            raw: true
        });
        return rol;
    } catch (err) {
        throw new Error(`Error al obtener rol de usuario: ${err.message}`);
    }
};

// Retrieves a list of indicadores based on user 
const getIndicadoresFromUser = async (id) => {
    try {
        const result = await Usuario.findOne({
            attributes: [],
            where: {
                id: id,
                activo: 'SI'
            },
            include: {
                model: Indicador,
                attributes: {
                    include: [
                        [Sequelize.literal('"indicadores->usuarioIndicador"."fechaHasta" - CURRENT_DATE'), 'remainingDays']
                    ]
                },
                through: {
                    as: 'usuarioIndicador',
                    attributes: [],
                    where: {
                        activo: 'SI',
                        fechaHasta: {
                            [Op.gte]: Sequelize.literal('CURRENT_DATE')
                        }
                    }
                }
            }
        });
        return {
            indicadores: result.dataValues.indicadores,
            total: result.dataValues.indicadores.length,
        }
    } catch (err) {
        throw new Error('Error al obtener indicadores de un usuario: ' + err.message);
    }
};

const updateUserStatus = async (id) => {

    try {
        const usuario = await Usuario.findOne({
            where: { id },
            attributes: ['activo'],
        });
        const nuevoEstado = usuario.activo === 'SI' ? 'NO' : 'SI';

        const updateUsuario = await Usuario.update(
            { activo: nuevoEstado },
            { where: { id: id } });
        return updateUsuario > 0;
    } catch (err) {
        throw new Error('Error al actualizar estado de usuario: ' + err.message);
    }
};

const updateUserPassword = async (id, password) => {
    try {
        const affectedRows = await Usuario.update(
            { clave: password },
            { where: { id: id } });
        return affectedRows > 0;
    } catch (err) {
        throw new Error(`Error al actualizar contraseña: ${err.message}`);
    }
};

const updateUserPasswordStatus = async (id) => {
    try {
        const actualStatus = await Usuario.findOne({
            attributes: ['requestedPasswordChange'],
            where: { id: id }
        });
        const newStatus = actualStatus.requestedPasswordChange === 'SI' ? 'NO' : 'SI';
        const affectedRows = await Usuario.update(
            { requestedPasswordChange: newStatus },
            { where: { id: id } });
        return affectedRows ? true : false;
    } catch (err) {
        throw new Error(`Error al actualizar contraseña: ${err.message}`);
    }
};

module.exports = {
    addUsuario,
    getUsuarioById,
    getUsuarioByCorreo,
    getUsuarios,
    isCorreoAlreadyInUse,
    updateUsuario,
    updateUserStatus,
    getRol,
    getIndicadoresFromUser,
    countInactiveUsers,
    updateUserPassword,
    updateUserPasswordStatus
}