const { Dimension, Sequelize, Indicador, Modulo } = require('../models');

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
};

const getDimension = async (req, res, next) => {
    const { idDimension } = req.matchedData;
    try {
        const dimension = await Dimension.findByPk(idDimension);
        if (dimension === null) {
            return res.sendStatus(404);
        }
        return res.status(200).json({ data: dimension });
    } catch (err) {
        next(err);
    }
};

const getModulosByDimension = async (req, res, next) => {
    const { idDimension } = req.matchedData;
    try {
        const modulos = await Modulo.findAll({
            include: [
                {
                    model: Indicador,
                    include: [
                        {
                            model: Dimension,
                            attributes: []
                        }
                    ],
                    attributes: []
                }
            ],
            attributes: ['id', 'temaIndicador'],
            where: {
                '$indicadores.idDimension$': idDimension
            },
        })

        return res.status(200).json({ data: modulos });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    countIndicadoresByDimension,
    editDimension,
    getDimension,
    getModulosByDimension
}