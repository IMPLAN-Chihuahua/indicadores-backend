const HistoricoService = require('../services/historicoService');
const { getPaginationHistoricos } = require('../utils/pagination');

const getHistoricos = async (req, res) => {
    const { idIndicador, order, sortBy } = req.matchedData;
    const { page, perPage } = getPaginationHistoricos(req.matchedData);
    try {
        const { historicos, total } = await HistoricoService.getHistoricos(idIndicador, page, perPage, order, sortBy);
        if (historicos.length > 0) {
            const totalPages = Math.ceil(total / perPage);
            return res.status(200).json({ idIndicador: idIndicador, page: page, perPage: perPage, total: total, totalPages: totalPages, data: historicos });
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getHistoricos
}