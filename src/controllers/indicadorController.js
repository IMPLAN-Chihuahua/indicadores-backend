const {
    Indicador,
    Ods,
    CoberturaGeografica,
    Fuente,
    UnidadMedida
} = require('../models');
const { Op } = require('sequelize');
const { getPagination } = require('../utils/pagination');

const getIndicadores = async (req, res) => {
    const {
        page,
        per_page
    } = getPagination(req.matchedData);
    try {
        const result = await Indicador.findAndCountAll({
            where: {
                idModulo: req.matchedData.idModulo,
                ...validateCatalog(req.matchedData),
                ...getIndicadorFilters(req.matchedData)
            },
            limit: per_page,
            offset: (per_page * (page - 1)),
            order: [getIndicadoresSorting(req.matchedData)],
            include: getIndicadorIncludes(req.matchedData),
        });

        const indicadores = result.rows;
        const total = result.count;
        const total_pages = Math.ceil(total / per_page);

        return res.status(200).json({
            page,
            per_page,
            total,
            total_pages,
            data: indicadores
        });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
};

const getIndicadorIncludes = ({
    idOds,
    idCobertura,
    idFuente,
    idUnidad
}) => {
    const indicadorFilter = [];


    indicadorFilter.push({
        model: Ods,
        required: true,
        //attributes: ['nombre'],
    });

    indicadorFilter.push({
        model: CoberturaGeografica,
        required: true
    });

    indicadorFilter.push({
        model: UnidadMedida,
        required: true
    });

    if (idFuente) {
        indicadorFilter.push({
            model: Fuente,
            where: {
                id: {
                    [Op.eq]: idFuente
                }
            }
        })
    }

    return indicadorFilter;
};

const validateCatalog = ({
    idOds,
    idCobertura,
    idUnidadMedida
}) => {
    const catalogFilters = {};
    if (idOds) {
        catalogFilters.idOds = idOds;
    }
    else if (idCobertura) {
        catalogFilters.idCobertura = idCobertura;
    }
    else if (idUnidadMedida) {
        catalogFilters.idUnidadMedida = idUnidadMedida;
    }
    return catalogFilters;
};

const getIndicadorFilters = (matchedData) => {
    const {
        anioUltimoValorDisponible,
        tendenciaActual
    } = matchedData;
    const filters = {};
    if (anioUltimoValorDisponible) {
        filters.anioUltimoValorDisponible = anioUltimoValorDisponible;
    }
    if (tendenciaActual) {
        filters.tendenciaActual = tendenciaActual;
    }
    return filters
};

const getIndicadoresSorting = ({
    sort_by,
    order
}) => {
    const arrangement = [];
    arrangement.push([sort_by || 'id', order || 'ASC'])
    return arrangement;
};

const getIndicador = async (req, res) => {
    try {
        const indicador = await Indicador.findByPk(req.matchedData.idIndicador);
        if (indicador === null) {
            return res.sendStatus(404);
        }
        return res.status(200).json({
            data: indicador
        });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {
    getIndicadores,
    getIndicador
};