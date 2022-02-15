const IndicadorService = require("../services/indicadorService")
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
  sequelize
} = require("../models");
const { Op } = sequelize;
const { getPagination } = require("../utils/pagination");
const { generateCSV, generateJSON, generateXLSX, generatePDF } = require("../services/generadorArchivosService");


const getIndicadores = async (req, res) => {
  const { page, per_page } = getPagination(req.matchedData);
  try {
    const { indicadores, total } = await IndicadorService.getIndicadores(page, per_page, req.matchedData);
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
    const indicador = await Indicador.findOne({
      where: {
        id: idIndicador,
      },
      include: [
        {
          model: UnidadMedida,
          required: true,
          attributes: [],
        },
        {
          model: Modulo,
          required: true,
          attributes: [],
        },
        {
          model: CoberturaGeografica,
          required: true,
          attributes: [],
        },
        {
          model: Ods,
          required: true,
          attributes: [],
        },
        {
          model: Historico,
          required: true,
          attributes: ["anio", "valor", "fuente"],
          limit: 5,
          order: [["anio", "DESC"]],
        },
        {
          model: Mapa,
          required: false,
          attributes: ['id', 'ubicacion', 'url']
        },
        {
          model: Formula,
          required: false,
          attributes: ['id', 'ecuacion', 'descripcion'],
          include: [
            {
              model: Variable,
              required: true,
              include: [{
                model: UnidadMedida,
                required: true,
                attributes: []
              }],
              attributes: ['nombre', 'nombreAtributo', 'dato', [sequelize.literal('"Formula->Variables->UnidadMedida"."nombre"'), "UnidadMedida"]],
            }
          ]
        }
      ],
      attributes: [
        "id",
        "nombre",
        "definicion",
        "urlImagen",
        [sequelize.literal('"Od"."nombre"'), "ods"],
        [sequelize.literal('"Modulo"."temaIndicador"'), "modulo"],
        "ultimoValorDisponible",
        [sequelize.literal('"UnidadMedida"."nombre"'), "unidadMedida"],
        "anioUltimoValorDisponible",
        [sequelize.literal('"CoberturaGeografica"."nombre"'), "coberturaGeografica"],
        "tendenciaActual",
        "tendenciaDeseada",
        "mapa",
      ],
    });

    if (indicador === null) {
      return res.sendStatus(404);
    }

    if (typeof format != 'undefined') {
      return generateFile(format, res, indicador)
    }

    return (res.status(200).json({ data: indicador, }))

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



const generateFile = (format, res, data) => {
  switch (format) {
    case 'json':
      const jsonFile = generateJSON(data);
      return (
        res.header('Content-disposition', 'attachment'),
        res.header('Content-Type', 'application/json'),
        res.attachment(`${data.nombre}.json`),
        res.send(jsonFile));
    case 'csv':
      const csvData = generateCSV(data);
      return (
        res.header('Content-disposition', 'attachment'),
        res.header('Content-Type', 'application/json'),
        res.attachment(`${data.nombre}.csv`),
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
