const {
    Indicador,
    Ods,
    CoberturaGeografica,
    Fuente,
    UnidadMedida
} = require('../models');
const {
    Op
} = require('sequelize');
const {
    getPagination
} = require('../utils/pagination');
const indicador = require('../models/indicador');

const getIndicadores = async (req, res) => {
    const {
        page,
        per_page
    } = getPagination(req.matchedData);
    console.log(req.matchedData.sort_by, req.matchedData.order);
    const filterOds = {};
    const idOds = req.matchedData.idOds;
    if (idOds) {
        filterOds['idOds'] = idOds;
    }

    try {
        const result = await Indicador.findAndCountAll({
            where: {
                idModulo: req.matchedData.idModulo,
                ...filterOds,
                ...getIndicadorFilters(req.matchedData)
            },
            limit: per_page,
            offset: (per_page * (page - 1)),
            order: [getIndicadoresSorting(req.matchedData)],
            include: getIndicadorIncludes(req.matchedData)
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
    })

    if (idCobertura) {
        indicadorFilter.push({
            model: CoberturaGeografica,
            where: {
                id: {
                    [op.eq]: idCobertura
                }
            }
        })
    } else if (idFuente) {
        indicadorFilter.push({
            model: Fuente,
            where: {
                id: {
                    [Op.eq]: idFuente
                }
            }
        })
    } else if (idUnidad) {
        indicadorFilter.push({
            model: UnidadMedida,
            where: {
                id: {
                    [Op.eq]: idUnidad
                }
            }
        })
    }



    return indicadorFilter;
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