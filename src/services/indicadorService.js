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
  sequelize,
  Sequelize
} = require("../models");
const { Op } = Sequelize;

const getIndicadores = async (page = 1, per_page = 15, matchedData) => {
  const result = await Indicador.findAndCountAll({
    where: {
      idModulo: matchedData.idModulo,
      ...validateCatalog(matchedData),
      ...getIndicadorFilters(matchedData),
    },
    limit: per_page,
    offset: per_page * (page - 1),
    order: [getIndicadoresSorting(matchedData)],
    include: getIndicadorIncludes(matchedData),
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
  return {
    indicadores: result.rows,
    total: result.count,
  };
};



const getIndicador = async (idIndicador, Format) => {
  const historicos = [
    {
      model: Historico,
      required: true,
      attributes: ["anio", "valor", "fuente"],
      limit: 5,
      order: [["anio", "DESC"]],
    },
    {
      model: Historico,
      required: false,
      attributes: ["anio", "valor", "fuente"],
      order: [["anio", "DESC"]],
    },
  ]
  let limit = [];
  typeof Format != 'undefined' ? limit = historicos[1] : limit = historicos[0];
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
        model: Ods,
        required: true,
        attributes: [],
      },
      {
        model: CoberturaGeografica,
        required: true,
        attributes: [],
      },
      limit,
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
            attributes: ['nombre', 'nombreAtributo', 'dato', [sequelize.literal('"Formula->Variables->UnidadMedida"."nombre"'), "Unidad"],],
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
  if (typeof Format === 'undefined' || indicador === null) {
    return indicador;
  }else {
    return {... indicador.dataValues};
  }
}

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

// Retrieves a list of indicadores based on user 
const getIndicadoresFromUser = async (id) => {
  try {
    const result = await Indicador.findAndCountAll({
      where: {
        createdBy: id,
      }
    });
    return {
      indicadores: result.rows,
      total: result.count,
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = { getIndicadores, getIndicador, getIndicadoresFromUser };