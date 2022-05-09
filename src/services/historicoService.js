const { Historico, Sequelize, Indicador, sequelize } = require('../models');
const { Op } = Sequelize

const getHistoricos = async (idIndicador, page, perPage, order, sortBy) => {

    const orderBy = getHistoricosSorting({ sortBy, order });
    try {
        const result = await Historico.findAndCountAll({
            where: {
                idIndicador
            },
            include: [{
                model: Indicador,
                attributes: []
            }],
            order: orderBy,
            limit: perPage,
            offset: (page - 1) * perPage,
            attributes: [
                'id',
                'valor',
                'anio',
                'fuente',
                'ecuacion',
                'descripcionEcuacion',
                'createdAt',
                [sequelize.literal('indicador.periodicidad'), "periodicidad"]
            ]
        });
        return { historicos: result.rows, total: result.count };
    } catch (err) {
        throw new Error(`Error al obtener los historicos: ${err.message}`);
    }
};

const getHistoricosSorting = ({ sortBy, order }) => {
    const arrangement = [];

    arrangement.push([sortBy || 'id', order || 'ASC']);

    return arrangement;
}


module.exports = {
    getHistoricos
}