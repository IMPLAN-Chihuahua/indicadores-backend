const { Modulo } = require('../models');

const getModulos = async (req, res) => {
    try {
        const modulos = await Modulo.findAll();
        return res.status(200).json({ data: modulos });
    } catch (err) {
        return res.sendStatus(500);
    }
}

module.exports = { getModulos }