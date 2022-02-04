const {
  Indicador,
  Ods,
  CoberturaGeografica,
  Fuente,
  UnidadMedida,
  Modulo,
  Historico,
  Mapa,
  Formula,
  Variable,
} = require("../models");
const { Op } = require("sequelize");
const { getPagination } = require("../utils/pagination");
const { serviceGetIndicador } = require("../services/indicadorService");

const sequelize = require("sequelize");
const { generateCSV, generateJSON, generateXLSX, generatePDF } = require("../services/generadorArchivosService");

const getIndicadores = async (req, res) => {
  const { page, per_page } = getPagination(req.matchedData);
  try {
    const result = await Indicador.findAndCountAll({
      where: {
        idModulo: req.matchedData.idModulo,
        ...validateCatalog(req.matchedData),
        ...getIndicadorFilters(req.matchedData),
      },
      limit: per_page,
      offset: per_page * (page - 1),
      order: [getIndicadoresSorting(req.matchedData)],
      include: getIndicadorIncludes(req.matchedData),
      attributes: [
        "id",
        "nombre",
        "ultimoValorDisponible",
        "anioUltimoValorDisponible",
        "tendenciaActual",
        "tendenciaDeseada",
        "idOds",
        [sequelize.literal('"Od"."nombre"'), "Ods"],
        "idCobertura",
        [sequelize.literal('"CoberturaGeografica"."nombre"'), "Cobertura"],
        "idUnidadMedida",
        [sequelize.literal('"UnidadMedida"."nombre"'), "Unidad"],
        "createdAt",
        "updatedAt",
        "idModulo",
      ],
    });

    const indicadores = result.rows;
    const total = result.count;
    const total_pages = Math.ceil(total / per_page);

    return res.status(200).json({
      page,
      per_page,
      total,
      total_pages,
      data: indicadores,
    });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
};

const getIndicador = async (req, res) => {
  try {
    const idIndicador = req.matchedData.idIndicador;
    const format = req.matchedData.format;
    
    const limit = 5;
    const indicador = serviceGetIndicador(idIndicador, format);
    
    if (indicador === null) {
      return res.sendStatus(404);
    }

    if (typeof format != 'undefined'){
      return generateFile(format, res, indicador)
    }

    return (res.status(200).json({data: indicador,}))

  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

// Includes for inner join to filter list 
const getIndicadorIncludes = ({ idFuente }) => {
  const indicadorFilter = [];

  indicadorFilter.push({
    model: Ods,
    required: true,
    attributes: []
  });

  indicadorFilter.push({
    model: CoberturaGeografica,
    required: true,
    attributes: []
  });

  indicadorFilter.push({
    model: UnidadMedida,
    required: true,
    attributes: []
  });

  if (idFuente) {
    indicadorFilter.push({
      model: Fuente,
      where: {
        id: {
          [Op.eq]: idFuente,
        },
      },
    });
  }

  return indicadorFilter;
};

// Validation for catalogs
const validateCatalog = ({ idOds, idCobertura, idUnidadMedida }) => {
  const catalogFilters = {};
  if (idOds) {
    catalogFilters.idOds = idOds;
  } else if (idCobertura) {
    catalogFilters.idCobertura = idCobertura;
  } else if (idUnidadMedida) {
    catalogFilters.idUnidadMedida = idUnidadMedida;
  }
  return catalogFilters;
};

// Validation for filters
const getIndicadorFilters = (matchedData) => {
  const { anioUltimoValorDisponible, tendenciaActual } = matchedData;
  const filters = {};
  if (anioUltimoValorDisponible) {
    filters.anioUltimoValorDisponible = anioUltimoValorDisponible;
  }
  if (tendenciaActual) {
    filters.tendenciaActual = tendenciaActual;
  }
  return filters;
};

// Sorting logic for list5
const getIndicadoresSorting = ({ sort_by, order }) => {
  const arrangement = [];
  arrangement.push([sort_by || "id", order || "ASC"]);
  return arrangement;
};

const generateFile = (format, res, data) => {
  switch(format) {
    case 'json':
      const jsonFile = generateJSON(data);
      return (
            res.header('Content-disposition', 'attachment'),
            res.header('Content-Type', 'application/json'),
            res.attachment(`${data.nombre}.csv`),
            res.send(jsonFile));
    case 'csv':
      const csvData = generateCSV(data);
      return (
            res.header('Content-disposition', 'attachment'),
            res.header('Content-Type', 'application/json'),
            res.attachment(`${data.nombre}.json`),
            res.send(csvData));
    case 'xlsx':
      const x = generateXLSX(res, data);
      return (
            res.header('Content-disposition', 'attachment'),
            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
            res.attachment(x)
            );
    case 'pdf':
      return generatePDF(res, data);
  }
}


module.exports = {
  getIndicadores,
  getIndicador,
};
