const { Tema, Sequelize, Indicador, IndicadorTema } = require('../models');
const { Op } = Sequelize;

const getPublicTemas = async (args) => {
    const { page, perPage, sortBy, order, searchQuery, ...filters } = args;

    try {
        const { rows, count } = await Tema.findAndCountAll({
            where: {
                activo: true,
                ...getPublicSearchQueryFilter(searchQuery)
            },
            order: [[sortBy, order]],
            limit: perPage,
            offset: (page - 1) * perPage,
            attributes: [
                'id',
                'temaIndicador',
                'codigo',
                'color',
                'descripcion',
            ],
        });
        return { temas: rows, total: count }
    } catch (err) {
        throw new Error(`Error al obtener temas ${err.message}`);
    }
};

const addTema = async (tema) => {
    try {
        const created = await Tema.create(tema);
        return created;
    } catch (err) {
        throw new Error(`Error al crear Tema ${err.message}`);
    }
};

const updateTema = async (id, values) => {
    try {
        const affectedRows = await Tema.update({ ...values },
            { where: { id } }
        );
        return affectedRows > 0;
    } catch (err) {
        throw new Error(`Error al actualizar Tema ${err.message}`);
    }
};

const isTemaIndicadorAlreadyInUse = async (temaIndicador) => {
    try {
        const existingTema = await Tema.findOne({
            attributes: ['temaIndicador'],
            where: { temaIndicador }
        });
        return existingTema != null;
    } catch (err) {
        throw new Error(`Error al buscar tema indicador ${err.message}`);
    }
};


const getPrivateTemas = async (args) => {
    const { page, perPage, sortBy, order, searchQuery, filters } = args;

    try {
        const result = await Tema.findAndCountAll({
            where: {
                ...getPrivateSearchQueryFilter(searchQuery),
                ...getPrivateTemasFilters(filters)
            },
            order: [[sortBy, order]],
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
        return { temas: result.rows, total: result.count };
    } catch (err) {
        throw new Error(`Error al obtener todos los temas ${err.message}`);
    }
};


const countTemas = async () => {
    try {
        const inactiveCount = await Tema.count({ where: { activo: false } });
        return inactiveCount;
    } catch (err) {
        throw new Error(`Error al contar temas ${err.message}`);
    }
}


const getPrivateSearchQueryFilter = (query) => {
    if (!query) return null;

    return {
        [Op.or]: [
            { temaIndicador: { [Op.iLike]: `%${query}%` } },
            { codigo: { [Op.iLike]: `%${query}%` } },
            { observaciones: { [Op.iLike]: `%${query}%` } },
            { descripcion: { [Op.iLike]: `%${query}%` } },
        ]
    }
};

const getPublicSearchQueryFilter = (query) => {
    if (!query) return null;

    return {
        [Op.or]: [
            { temaIndicador: { [Op.iLike]: `%${searchQuery}%` } },
            { descripcion: { [Op.iLike]: `%${searchQuery}%` } },
        ]
    }
};


const getPrivateTemasFilters = (args) => {
    const { activo = null } = args || {};
    const filters = []

    if (activo !== null) {
        console.log('activo value', activo)
        filters.push({ activo })
    }

    return {
        [Op.and]: filters
    }
}


const updateTemaStatus = async (id) => {
    try {
        const tema = await Tema.findOne({
            where: { id },
            attributes: ['activo', 'id'],
        });

        const nuevoEstado = tema.activo === true ? false : true;

        const updatedTema = await tema.update(
            { activo: nuevoEstado },
            { where: { id } }
        );

        return updatedTema;

    } catch (err) {
        throw new Error(`Error al buscar el módulo ${err.message}`);
    }
}

module.exports = {
    getPublicTemas,
    countTemas,
    addTema,
    isTemaIndicadorAlreadyInUse,
    updateTema,
    getPrivateTemas,
    updateTemaStatus
}