const { Modulo, Sequelize, Indicador } = require('../models');

const { Op } = Sequelize;

const getModulos = async () => {
    try {
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
                'descripcion',
                [Sequelize.fn('COUNT', Sequelize.col('indicadores.id')), 'indicadoresCount']
            ],
            include: [{
                model: Indicador,
                attributes: []
            }],
            group: ['Modulo.id'],
            order: [['id']],
            raw: true
        });
        return modulos;
    } catch (err) {
        throw new Error(`Error al obtener modulos ${err.message}`);
    }
};

const addModulo = async (modulo) => {
    try {
        const created = await Modulo.create(modulo);
        return created;
    } catch (err) {
        return Promise.reject(new Error(`Error al crear modulo ${err.message}`));
    }
};

const updateModulo = async (id, values) => {
    try {
        const affectedRows = await Modulo.update({ ...values },
            { where: { id } }
        );
        return affectedRows > 0;
    } catch (err) {
        throw new Error(`Error al actualizar modulo ${err.message}`);
    }
};

const isTemaIndicadorAlreadyInUse = async (temaIndicador) => {
    try {
        const existingTema = await Modulo.findOne({
            attributes: ['temaIndicador'],
            where: { temaIndicador }
        });
        return existingTema != null;
    } catch (err) {
        throw new Error(`Error al buscar tema indicador ${err.message}`);
    }
};

const getAllModulos = async (page, perPage, matchedData) => {
    try {
        const result = await Modulo.findAndCountAll({
            where: getAllModulosFilters(matchedData),
            order: getModulosSorting(matchedData),
            limit: perPage,
            offset: (page - 1) * perPage,
            attributes: [
                'id',
                'codigo',
                'temaIndicador',
                'createdAt',
                'updatedAt',
                'urlImagen',
                'color',
                'observaciones',
                'activo',
                'descripcion'
            ],
        });
        const inactiveModulos = await countModulos();
        return { modulos: result.rows, total: result.count, totalInactivos: inactiveModulos };
    } catch (err) {
        throw new Error(`Error al obtener todos los modulos ${err.message}`);
    }
};

const countModulos = async () => {
    try {
        const inactiveCount = await Modulo.count({ where: { activo: 'NO' } });
        return inactiveCount;
    } catch (err) {
        throw new Error(`Error al contar modulos ${err.message}`);
    }
}


const getModulosSorting = ({ sortBy, order }) => {
    const arrangement = [];
    arrangement.push([sortBy || 'id', order || 'ASC']);
    return arrangement;
};

const getAllModulosFilters = (matchedData) => {
    const { searchQuery } = matchedData;
    if (searchQuery) {
        const filter = {
            [Op.or]: [
                { temaIndicador: { [Op.iLike]: `%${searchQuery}%` } },
                { codigo: { [Op.iLike]: `%${searchQuery}%` } },
                { observaciones: { [Op.iLike]: `%${searchQuery}%` } },
                { activo: { [Op.iLike]: `%${searchQuery}%` } }
            ]
        }
        return filter;
    }
    return {};
};

const updateModuloStatus = async (id) => {
    try {
        const modulo = await Modulo.findOne({
            where: { id },
            attributes: ['activo'],
        });
        const nuevoEstado = modulo.activo === 'SI' ? 'NO' : 'SI';
        const updatedModulo = await Modulo.update(
            { activo: nuevoEstado },
            { where: { id } }
        );
        return updatedModulo > 0;
    } catch (err) {
        throw new Error(`Error al buscar el módulo ${err.message}`);
    }
}

module.exports = {
    getModulos,
    countModulos,
    addModulo,
    isTemaIndicadorAlreadyInUse,
    updateModulo,
    getAllModulos,
    updateModuloStatus
}