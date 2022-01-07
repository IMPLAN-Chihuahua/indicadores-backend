const { Modulo } = require('../models');

const moduloExists = async (req, res, next) => {
    const { idModulo } = req.matchedData;
    try {
        const exists = await Modulo.findOne({ attributes: ['id'], where: { id: idModulo } });
        if (exists) {
            next();
        } else {
            return res.status(404).json({ message: 'Modulo con ' + idModulo + ' no existe' });
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};


module.exports = { moduloExists }