const { Modulo } = require('../models/modulo');

const getModulos = async (_, res) => {
    try {
        const modulos = await Modulo.findAll();
        return res.status(200).json({ data: modulos });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
}

module.exports = { getModulos }