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
};

const deleteHistorico = async (idHistorico) => {
    try {
        const response = Historico.destroy({
            where: { id: idHistorico }
        });
        return response;
    } catch (err) {
        throw new Error(`Error al eliminar el historico: ${err.message}`);
    }
};

const updateHistorico = async (idHistorico, historico) => {
    try {
        const affectedRows = await Historico.update(
            { ...historico }, {
            where: { id: idHistorico }
        });
        return affectedRows > 0;
    } catch (err) {
        throw new Error(`Error al actualizar el historico: ${err.message}`);
    };
};

const createHistorico = async (idIndicador, historico) => {
    try {
        const response = await Historico.create({
            idIndicador: idIndicador,
            valor: historico.valor,
            anio: historico.anio,
            fuente: historico.fuente,
            ecuacion: 'NAN',
            descripcionEcuacion: 'NAN',
            fechaIngreso: new Date(),
            pushedBy: 1,
        });
        return response;
    } catch (err) {
        throw new Error(`Error al crear el historico: ${err.message}`);
    }
}

module.exports = {
    getHistoricos,
    deleteHistorico,
    updateHistorico,
    createHistorico,
}