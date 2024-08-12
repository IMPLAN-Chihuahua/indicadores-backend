const { QueryTypes } = require('sequelize');
const { Dimension, Sequelize, Indicador, Modulo, IndicadorObjetivo, sequelize } = require('../models');

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

const getTemasInObjetivo = async (req, res, next) => {
    const { idObjetivo, page, perPage } = req.matchedData;
    const temas = await sequelize.query(`
            SELECT m."id", m."temaIndicador" FROM "Modulos" m
            INNER JOIN "Indicadores" i on i."idModulo" = m."id"
            INNER JOIN "IndicadorObjetivos" io on io."idIndicador" = i."id"
            WHERE io."idObjetivo" = :idObjetivo
            GROUP BY m."id", m."temaIndicador"`, {
        replacements: {
            idObjetivo
        },
        type: QueryTypes.SELECT
    })

    return res.status(200).json({ data: temas });
}

module.exports = {
    countIndicadoresByDimension,
    editDimension,
    getDimension,
    getTemasInObjetivo
}