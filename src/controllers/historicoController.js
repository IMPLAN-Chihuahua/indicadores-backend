const HistoricoService = require('../services/historicoService');
const IndicadorService = require("../services/indicadorService")
const { getPaginationHistoricos } = require('../utils/pagination');

const getHistoricos = async (req, res, next) => {
    const { idIndicador, order, sortBy } = req.matchedData;
    const { page, perPage } = getPaginationHistoricos(req.matchedData);
    try {
        const { ultimoValorDisponible, updatedAt, periodicidad } = await IndicadorService.getIndicador(idIndicador, 'front');

        const { historicos, total } = await HistoricoService.getHistoricos(idIndicador, page, perPage, order, sortBy);
        if (historicos.length > 0) {
            const totalPages = Math.ceil(total / perPage);
            console.log(historicos);
            return res.status(200).json({ idIndicador: idIndicador, indicadorLastValue: ultimoValorDisponible, indicadorLastUpdateDate: updatedAt, indicadorPeriodicidad: periodicidad, page: page, perPage: perPage, total: total, totalPages: totalPages, data: historicos });
        } else {
            return res.status(200).json({ idIndicador: idIndicador, indicadorLastValue: ultimoValorDisponible, indicadorLastUpdateDate: updatedAt, indicadorPeriodicidad: periodicidad, page: page, perPage: perPage, total: total, totalPages: 0, data: [] });
        }

    } catch (err) {
        next(err)
    }
};

const deleteHistorico = async (req, res, next) => {
    const { idHistorico, ...historico } = req.matchedData;
    try {
        await HistoricoService.deleteHistorico(idHistorico);
        return res.status(200).json({ message: 'Historico eliminado' });
    } catch (err) {
        next(err)
    }
};

const updateHistorico = async (req, res, next) => {
    const { idHistorico, ...historico } = req.matchedData;
    try {
        const response = await HistoricoService.updateHistorico(idHistorico, historico);

        if (response) {
            return res.sendStatus(204);
        }

        return res.sendStatus(400);
    } catch (err) {
        next(err)
    };
};

module.exports = {
    getHistoricos,
    deleteHistorico,
    updateHistorico,
}