const { Dimension, Sequelize, Indicador } = require('../models');

const countIndicadoresByDimension = async (req, res, next) => {
    try {
        const result = await Dimension.findAll({
            attributes: [
                'id',
                'titulo',
                'descripcion',
                'urlImagen',
                'color',
                [Sequelize.fn('COUNT', Sequelize.col('indicadores.id')), 'indicadoresCount']
            ],
            include: [{
                model: Indicador,
                attributes: []
            }],
            group: ['Dimension.id'],
            order: [['id']],
            raw: true
        });

        return res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const editDimension = async (req, res, next) => {
    const { idModulo, ...fields } = req.matchedData;
    const image = getImagePathLocation(req);

    try {
        const updateDimension = 1;

        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }

}

module.exports = {
    countIndicadoresByDimension,
    editDimension
}