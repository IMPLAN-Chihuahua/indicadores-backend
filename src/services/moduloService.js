const { Modulo, sequelize, Sequelize, Indicador } = require('../models');

const getModulos = async () => {
    const modulos = await Modulo.findAll({
        where: {
            activo: 'SI'
        },
        attributes: [
            'id',
            'temaIndicador',
            'codigo',
            'urlImagen',
            'color',
            [Sequelize.fn('COUNT', Sequelize.col('indicadores.id')), 'indicadoresCount']
        ],
        include: [{
            model: Indicador,
            attributes: []
        }],
        group: ['Modulo.id'],
        order: [['id']],
    });
    return modulos;
}

const addModulo = async (modulo) => {
    try {
        const {
            temaIndicador,
            observaciones,
            activo,
            codigo,
            urlImagen,
            color,
        } = await Modulo.create(modulo);
        return {
            temaIndicador,
            observaciones,
            activo,
            codigo,
            urlImagen,
            color,
        }
    
    } catch(err) {
        return Promise.reject(new Error(`Error al crear modulo ${err.message}`));
    }
};

const updateModulo = async (id, {temaIndicador, observaciones, activo, codigo, urlImagen, color}) => {
    try {
        const affectedRows = await Modulo.update(
            {temaIndicador, observaciones, activo, codigo, urlImagen, color},
            {where: {id: id}}
        );
        return affectedRows > 0;
    } catch(err) {
        throw new Error(`Error al actualizar modulo ${err.message}`);
    }
};
 
const isTemaIndicadorAlreadyInUse = async (temaIndicador) => {
    try {
        const existingTema = await Modulo.findOne({
            attributes: ['temaIndicador'],
            where: {temaIndicador: temaIndicador}
        });
        return existingTema != null;
    } catch(err) {
        throw new Error(`Error al buscar tema indicador ${err.message}`);
    }
}

const getAllModulos = async (page = 1, per_page = 5) => {
    try{
        const result = await Modulo.findAndCountAll({
            limit: per_page,
            offset: (page - 1) * per_page,
            order: [['id', 'ASC']],
            attributes: ['id', 'codigo', 'temaIndicador', 'createdAt', 'updatedAt', 'urlImagen', 'color', 'observaciones', 'activo'],
        });
        const inactiveModulos = await Modulo.count({where: {activo: 'NO'}});
        return {modulos: result.rows, total: result.count, totalInactivos: inactiveModulos};
    } catch(err) {
        throw new Error(`Error al obtener todos los modulos ${err.message}`);
    }
}

module.exports = {
    getModulos,
    addModulo,
    isTemaIndicadorAlreadyInUse,
    updateModulo,
    getAllModulos
}