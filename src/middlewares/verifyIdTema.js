const { Tema } = require('../models');

const temaExists = async (req, res, next) => {
    const { idTema } = req.matchedData;
    try {
        const exists = await Tema.findOne({ attributes: ['id'], where: { id: idTema } });
        if (exists) {
            next();
        } else {
            return res.status(404).json({ message: `Tema con ${idTema} no existe` });
        }
    } catch (err) {
        next(err);
    }
};


module.exports = { temaExists }