const { Modulo } = require('../models/modulo');
const { Indicador } = require('../models/indicador');

const getIndicadores = async (req, res) => {
    const page = req.matchedData.page || 1;
    const per_page = req.matchedData.per_page || 15;
    const filters = req.matchedData;

    delete filters.page;
    delete filters.per_page;

    try {
        const { idModulo } = req.matchedData;
        const exists = await Modulo.findByPk(idModulo);
        
        if (exists === null) {
            return res.status(404).send({
                message: 'Modulo no encontrado'
            });
        };

        const result = await Indicador.findAndCountAll(
            {
                where: { idModulo, ...filters },
                limit: per_page, offset: (per_page * (page - 1))
            });
    
        const indicadores = result.rows;
        const total = result.count;
        const total_pages = Math.ceil(total / per_page);

        return res.status(200).json({ page, per_page, total, total_pages, data: indicadores });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
};


const getIndicador = async (req, res) => {
    try {
        const indicador = await Indicador.findByPk(req.matchedData.idIndicador);
        if (indicador === null) {
            return res.sendStatus(404);
        }
        return res.status(200).json({ data: indicador });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};


module.exports = { getIndicadores, getIndicador };