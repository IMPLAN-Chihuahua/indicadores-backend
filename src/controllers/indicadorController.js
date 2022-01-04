const { Modulo } = require('../models/modulo');
const { Indicador } = require('../models/indicador');

const getIndicadores = async (req, res) => {
    const page = parseInt(req.query.page || 1, 10);
    const per_page = parseInt(req.query.per_page || 15, 10);
    const filters = req.query;
    delete filters.page;
    delete filters.per_page;

    try {
        const { id } = req.params;
        const exists = await Modulo.findOne({ where: { id } });
        if (exists === null) {
            return res.status(404).send({
                message: 'Modulo no encontrado'
            });
        };
        const result = await Indicador.findAndCountAll(
            { where: { idModulo: id, ...filters }, limit: per_page, offset: (per_page * (page - 1)) });
        const indicadores = result.rows;
        const total = result.count;
        const total_pages = Math.ceil(total / per_page);
        return res.status(200).json({ page, per_page, total, total_pages, data: indicadores });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
};

module.exports = { getIndicadores };