const HistoricoService = require('../services/historicoService');
const IndicadorService = require("../services/indicadorService")
const { getPaginationHistoricos } = require('../utils/pagination');

const getHistoricos = async (req, res) => {
    const { idIndicador, order, sortBy } = req.matchedData;
    const { page, perPage } = getPaginationHistoricos(req.matchedData);
    try {
        const { ultimoValorDisponible, updatedAt, periodicidad } = await IndicadorService.getIndicador(idIndicador, 'front');

        const { historicos, total } = await HistoricoService.getHistoricos(idIndicador, page, perPage, order, sortBy);
        console.log('asdkfga');
        console.log(historicos);
        if (historicos.length > 0) {
            const totalPages = Math.ceil(total / perPage);
            return res.status(200).json({ idIndicador: idIndicador, indicadorLastValue: ultimoValorDisponible, indicadorLastUpdateDate: updatedAt, indicadorPeriodicidad: periodicidad, page: page, perPage: perPage, total: total, totalPages: totalPages, data: historicos });
        }

    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const deleteHistorico = async (req, res) => {
    const { idHistorico, ...historico } = req.matchedData;
    try {
        await HistoricoService.deleteHistorico(idHistorico);
        return res.status(200).json({ message: 'Historico eliminado' });
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateHistorico = async (req, res) => {
    console.log('eteasd;');
    const { idHistorico, ...historico } = req.matchedData;
    console.log(idHistorico);
    console.log(historico);

    try {
        const response = await HistoricoService.updateHistorico(idHistorico, historico);

        if (response) {
            return res.sendStatus(204);
        }

        return res.sendStatus(400);
    } catch (err) {
        return res.status(500).json(err.message);
    };
};

module.exports = {
    getHistoricos,
    deleteHistorico,
    updateHistorico,
}