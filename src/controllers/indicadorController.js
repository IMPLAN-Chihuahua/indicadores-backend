const { Modulo } = require('../models');

const getIndicadores = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await Modulo.findOne({ where: { id } });
        if (exists === null) {
            return res.status(404).send({
                message: 'Modulo no encontrado'
            });
        };
        return res.status(200).json({message: 'hey'});
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
};

module.exports = { getIndicadores };