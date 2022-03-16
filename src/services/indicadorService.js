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

const getIndicadores = async (page, perPage, matchedData) => {
  const result = await Indicador.findAndCountAll({
    where: {
      idModulo: matchedData.idModulo,
      ...validateCatalog(matchedData),
      ...getIndicadorFilters(matchedData),
    },
    limit: perPage,
    offset: perPage * (page - 1),
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
      [sequelize.literal('"ods"."nombre"'), "ods"],
      "idCobertura",
      [sequelize.literal('"coberturaGeografica"."nombre"'), "coberturaGeografica"],
      "idUnidadMedida",
      [sequelize.literal('"unidadMedida"."nombre"'), "unidadMedida"],
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

const getIndicador = async (idIndicador, Format, pathway) => {
  console.log(defineIndicadorInformation(Format, pathway));
  
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
  limit = typeof Format !== 'undefined' ? historicos[1] : historicos[0];
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
            attributes: [
              'nombre',
              'nombreAtributo',
              'dato',
              [sequelize.literal('"formula->variables->unidadMedida"."nombre"'), "unidadMedida"],],
          }
        ]
      }
    ],
    attributes: [
      "id",
      "nombre",
      "definicion",
      "urlImagen",
      [sequelize.literal('"ods"."nombre"'), "ods"],
      [sequelize.literal('"modulo"."temaIndicador"'), "modulo"],
      "ultimoValorDisponible",
      [sequelize.literal('"unidadMedida"."nombre"'), "unidadMedida"],
      "anioUltimoValorDisponible",
      [sequelize.literal('"coberturaGeografica"."nombre"'), "coberturaGeografica"],
      "tendenciaActual",
      "tendenciaDeseada",
    ],
  });
  if (typeof Format === 'undefined' || indicador === null) {
    return indicador;
  }
  return { ...indicador.dataValues };
}

const defineIndicadorInformation = (format, pathway) => {
  let limitOfHistoricos = [];
  switch(pathway) {
    case 'file': {
      limitOfHistoricos.push({
        model: Historico,
        required: false,
        attributes: ["anio", "valor", "fuente"],
        order: [["anio", "DESC"]],
      }); return limitOfHistoricos;
    };
    case 'site': {
      limitOfHistoricos.push({
        model: Historico,
        required: true,
        attributes: ["anio", "valor", "fuente"],
        limit: 5,
        order: [["anio", "DESC"]],
      }); return limitOfHistoricos;
    };
  };
};

const getAllIndicadores = async (page, perPage, matchedData) => {
  try {
  const result = await Indicador.findAndCountAll({
    where: getAllIndicadoresFilters(matchedData),
    order: getIndicadoresSorting(matchedData),
    limit: perPage,
    offset: (page - 1) * perPage,
  });
  return {indicadores: result.rows, total: result.count};
  } catch(err) {
    throw new Error(`Error al obtener los indicadores: ${err.message}`);
  }
}


const getAllIndicadoresFilters = (matchedData) => {
  const { searchQuery } = matchedData;
  if (searchQuery) {
    const filter = {
      [Op.or]: [
        { nombre: { [Op.like]: `%${searchQuery}%` } },
        { definicion: { [Op.like]: `%${searchQuery}%` } },
        { codigo: { [Op.like]: `%${searchQuery}%` } },
        { codigoObjeto: { [Op.like]: `%${searchQuery}%` } },
        { tendenciaActual: { [Op.like]: `%${searchQuery}%` } },
        { tendenciaDeseada: { [Op.like]: `%${searchQuery}%` } },
        { observaciones: { [Op.like]: `%${searchQuery}%` } },
      ]
    };
    return filter;
  }
  return {};
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
const getIndicadoresSorting = ({ sortBy, order }) => {
  const arrangement = [];
  arrangement.push([sortBy || "id", order || "ASC"]);
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

const getCreateIndicadorIncludes = (indicador) => {
  const includes = [];
  if (indicador.formula) {
    includes.push({
      association: Indicador.associations.formula,
      include: [Formula.associations.variables]
    });
  }
  if (indicador.historicos) {
    includes.push(Indicador.associations.historicos);
  }
  if (indicador.fuentes) {
    includes.push(Indicador.associations.fuentes);
  }
  if (indicador.mapa) {
    includes.push(Indicador.associations.mapa);
  }
  return { include: includes };
};

const createIndicador = async (indicador) => {
  const t = await sequelize.transaction();
  try {

    const createdIndicador = await Indicador.create(indicador, {
      ...getCreateIndicadorIncludes(indicador), transaction: t
    });

    await t.commit();
    return createdIndicador;

  } catch (err) {
    await t.rollback();
    throw new Error(`Error al crear indicador: ${err.message}`);
  }
};

const updateIndicador = async (id, indicador) => {
  try {
    const affectedRows = await Indicador.update({ ...indicador }, { where: { id } });
    return affectedRows > 0;
  } catch (err) {
    throw new Error(`Error al actualizar indicador: ${err.message}`);
  }
};

module.exports = {
  getIndicadores,
  getIndicador,
  createIndicador,
  getAllIndicadores,
  updateIndicador,
};