const { Modulo, sequelize, Sequelize, Indicador } = require('../models');
const { Op } = Sequelize;

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
};

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
};

const getAllModulos = async (page = 1, per_page = 5, matchedData) => {
    try{
        const result = await Modulo.findAndCountAll({
            where: getAllModulosFilters(matchedData),
            limit: per_page,
            offset: (page - 1) * per_page,
            order:  getModulosSorting(matchedData), 
            attributes: ['id', 'codigo', 'temaIndicador', 'createdAt', 'updatedAt', 'urlImagen', 'color', 'observaciones', 'activo'],
        });
        const inactiveModulos = await Modulo.count({where: {activo: 'NO'}});
        return {modulos: result.rows, total: result.count, totalInactivos: inactiveModulos};
    } catch(err) {
        throw new Error(`Error al obtener todos los modulos ${err.message}`);
    }
};


const getModulosSorting = ({ sort_by, order }) => {
    const arrangement = [];
    arrangement.push([sort_by || 'id', order || 'ASC']);
    return arrangement;
};

const getAllModulosFilters = (matchedData) => {
    const {searchQuery} = matchedData;
    if (searchQuery) {
        const filter = {
            [Op.or]: [
                {temaIndicador: {[Op.iLike]: `%${searchQuery}%`}},
                {codigo: {[Op.iLike]: `%${searchQuery}%`}},
                {observaciones: {[Op.iLike]: `%${searchQuery}%`}},
                {activo: {[Op.iLike]: `%${searchQuery}%`}}
            ]
        }
        return filter;
    } else {
        return {};
    }
};

module.exports = {
    getModulos,
    addModulo,
    isTemaIndicadorAlreadyInUse,
    updateModulo,
    getAllModulos
}