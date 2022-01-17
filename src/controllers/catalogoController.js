const { Ods, CoberturaGeografica, Fuente } = require('../models');


const getOds = async (_, res) => {
    try {
        const cobertura = await CoberturaGeografica.findAll();
        const ods = await Ods.findAll();
        return res.status(200).json({ ods: ods, cobertura: cobertura });
    } catch(err) {
        console.log(err);
        return res.status(500);
    }
};



module.exports = { getOds };
