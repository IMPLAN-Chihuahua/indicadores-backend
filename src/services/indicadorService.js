/* eslint-disable no-use-before-define */
const { SITE_PATH, FRONT_PATH, FILE_PATH } = require("../middlewares/determinePathway");

const models = require("../models");
const {
  Indicador,
  Tema,
  Historico,
  Mapa,
  Formula,
  Variable,
  sequelize,
  Sequelize,
  Catalogo,
  CatalogoDetail,
  CatalogoDetailIndicador,
  Dimension,
  IndicadorObjetivo
} = models;
const { toggleStatus } = require("../utils/objectUtils");
const { updateOrCreateCatalogosFromIndicador, addCatalogosToIndicador } = require("./catalogosService");
const { createRelation } = require("./usuarioIndicadorService");
const { Op } = Sequelize;

const getIndicadores = async (page, perPage, matchedData, pathway) => {

  const { where, order, attributes, includes } = getDefinitionsForIndicadores(pathway, matchedData);
  try {
    const result = await Indicador.findAndCountAll({
      limit: perPage,
      offset: (page - 1) * perPage,
      where,
      order,
      include: includes,
      attributes: attributes,
      distinct: true
    });

    return { indicadores: result.rows, total: result.count };
  } catch (err) {
    throw err;
  }
};

const findAllIndicadoresInDimension = async ({ page, perPage, searchQuery, filters }) => {
  const { idObjetivo, destacado = false, offset } = filters;
  try {
    const result = await Indicador.findAll({
      limit: perPage,
      offset: offset || (page - 1) * perPage,
      attributes: [
        'id',
        'nombre',
        'tendenciaActual',
        'ultimoValorDisponible',
        'anioUltimoValorDisponible'
      ],
      where: {
        activo: 'SI'
      },
      include: [
        {
          model: Tema,
          required: true,
          attributes: ['id', 'temaIndicador', 'descripcion', 'color', 'codigo', 'activo'],
        },
        {
          model: CatalogoDetail,
          as: 'catalogos',
          required: false,
          include: Catalogo,
          through: {
            model: CatalogoDetailIndicador,
            attributes: [],
          },
        },
        {
          model: Dimension,
          as: 'objetivos',
          required: true,
          attributes: [
            'id',
            'titulo',
            [sequelize.literal('"objetivos->more"."destacado"'), 'destacado']
          ],
          where: {
            id: idObjetivo,
          },
          through: {
            as: 'more',
            model: IndicadorObjetivo,
            attributes: [],
            where: {
              destacado
            }
          },
        }
      ],
    });
    return result;
  } catch (err) {
    throw err;
  }
}


const countIndicadoresInDimension = async ({ filters, searchQuery }) => {
  const { idObjetivo, destacado } = filters;
  const count = await Indicador.count({
    where: {
      activo: 'SI',
    },
    include: [{
      model: Dimension,
      as: 'objetivos',
      where: {
        id: idObjetivo,

      },
      through: {
        as: 'more',
        model: IndicadorObjetivo,
        attributes: [],
        where: {
          destacado
        }
      },
    }]
  })
  return count;
}

const getInactiveIndicadores = async () => {
  const indicadores = await Indicador.findAndCountAll({
    where: { activo: 'NO' },
    attributes: ["id", "nombre"],
    raw: true
  });
  return indicadores;
}

const getDefinitionsForIndicadores = (pathway, queryParams) => {
  const attributes = defineAttributes(pathway, queryParams);
  const includes = defineIncludesForIndicadores(queryParams);
  const order = defineOrder(pathway, queryParams);
  const where = defineWhere(pathway, queryParams);
  return {
    attributes,
    includes,
    order,
    where,
  };
};

const defineAttributes = (pathway, matchedData) => {
  const attributes = ["id", "nombre", "ultimoValorDisponible", "activo",
    "anioUltimoValorDisponible", "tendenciaActual", "fuente", "createdBy", "updatedAt", "periodicidad", "owner", "archive",];

  switch (pathway) {
    case FILE_PATH:
      attributes.push("definicion", "urlImagen")
      return attributes;
    case SITE_PATH:
      if (matchedData) {
        attributes.push("createdAt", "updatedAt", "idTema")
      } else {
        attributes.push("definicion", "urlImagen")
      }
      return attributes;
    case FRONT_PATH:
      attributes.push(
        "definicion",
        "codigo",
        "owner",
        "observaciones",
        "createdBy",
        "updatedBy",
        "idTema",
        "createdAt",
        "updatedAt",)
      return attributes;
    default:
      throw new Error('Invalid pathway');
  }
};

const defineOrder = (pathway, matchedData) => {
  const order = [];
  switch (pathway) {
    case SITE_PATH:
      order.push(getIndicadoresSorting(matchedData))
      return order;
    case FRONT_PATH:
      order.push(getIndicadoresSorting(matchedData))
      return order;
    default:
      throw new Error('Invalid pathway')
  };
};

// Sorting logic for list
const getIndicadoresSorting = ({ sortBy, order }) => {
  const arrangement = [];
  arrangement.push([sortBy || "id", order || "ASC"]);
  return arrangement;
};

const defineWhere = (pathway, matchedData) => {
  let where = {};

  switch (pathway) {
    case SITE_PATH:
      where = {
        ...filterIndicadorBy(matchedData),
        ...getIndicadoresFilters(matchedData),
        ...advancedSearch(matchedData),
      };
      break;
    case FRONT_PATH:
      where = {
        ...getIndicadoresFilters(matchedData),
        ...advancedSearch(matchedData),
      }
      break;

    default:
      throw new Error('Invalid pathway')
  }
  return where;
};

const getIndicador = async (idIndicador, pathway) => {
  const includes = defineIncludesForAnIndicador(pathway);
  const attributes = defineAttributes(pathway);
  try {
    let indicador = await Indicador.findOne({
      where: { id: idIndicador, },
      include: includes,
      attributes,
    });

    if (pathway !== FILE_PATH || indicador === null) {
      console.log(indicador)
      const temaID = indicador.Tema.id;
      const { prevIndicador, nextIndicador } = await definePrevNextIndicadores(temaID, idIndicador);
      indicador['prev'] = prevIndicador;
      indicador['next'] = nextIndicador;
      return indicador;
    }

    return { ...indicador.dataValues };
  } catch (err) {
    throw err;
  }
};

const getIndicadoresFromTemaInteres = async (id) => {
  const indicadores = await Indicador.findAll({
    where: { idTema: id },
    attributes: ["id"],
    raw: true
  });
  return indicadores;
}

const definePrevNextIndicadores = async (temaId, idIndicador) => {
  const indicadores = await getIndicadoresFromTemaInteres(temaId);
  const indicadorIndex = indicadores.findIndex(indicador => indicador.id === idIndicador);
  const indicadoresSize = indicadores.length;

  const prevIndex = indicadorIndex === 0 ? null : indicadorIndex - 1;
  const nextIndex = indicadorIndex === indicadoresSize - 1 ? null : indicadorIndex + 1;

  const prevIndicador = indicadores[prevIndex] === undefined ? null : indicadores[prevIndex].id;
  const nextIndicador = indicadores[nextIndex] === undefined ? null : indicadores[nextIndex].id;

  return { prevIndicador, nextIndicador };
}

const getIndicadoresFilters = (matchedData) => {

  const { searchQuery } = matchedData;
  if (searchQuery) {
    const filter = {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${searchQuery}%` } },
        { definicion: { [Op.iLike]: `%${searchQuery}%` } },
        { codigo: { [Op.iLike]: `%${searchQuery}%` } },
        { observaciones: { [Op.iLike]: `%${searchQuery}%` } },
      ]
    };
    return filter;
  }
  return {};
};

const advancedSearch = (matchedData) => {
  const { idDimensions, owner, temas } = matchedData
  let filter = {}

  // if (idDimensions) {
  //   const dimensionsArray = idDimensions ? idDimensions.split(',') : null;
  //   filter.idDimension = dimensionsArray;
  // }

  if (owner) {
    filter.owner = owner;
  }

  if (temas) {
    const temasArray = temas ? temas.split(',') : null;
    filter.idTema = temasArray;
  }


  return filter;
};

const filterIndicadorBy = (matchedData) => {
  const { anioUltimoValorDisponible, tendenciaActual, idTema, idDimension } = matchedData;
  const filters = { activo: 'SI' };
  if (anioUltimoValorDisponible) {
    filters.anioUltimoValorDisponible = anioUltimoValorDisponible;
  }
  if (tendenciaActual) {
    filters.tendenciaActual = tendenciaActual;
  }

  if (idTema) {
    filters.idTema = idTema;
  }

  // if (idDimension) {
  //   filters.idDimension = idDimension;
  // }

  return filters;
};

const createIndicador = async (indicador) => {
  const { catalogos, ...values } = indicador;
  try {
    const result = await sequelize.transaction(async _t => {
      const created = await Indicador.create(
        values,
        {
          include: [{
            association: Indicador.associations.formula,
            include: [Formula.associations.variables]
          }, {
            association: Indicador.associations.mapa
          }]
        }
      );

      if (catalogos) {
        await addCatalogosToIndicador(catalogos, created.id)
      }

      await assignIndicadorToUsuario(created.id, indicador.owner)
      return created;
    })

    return result;
  } catch (err) {
    throw new Error(`Error al crear indicador: ${err.message}`);
  }
};

const assignIndicadorToUsuario = (idIndicador, idUsuario) => {
  return createRelation(
    [idUsuario], [idIndicador], {
    fechaDesde: null,
    fechaHasta: null,
    updatedBy: idUsuario,
    createdBy: idUsuario,
    expires: 'NO'
  })
}


const updateIndicadorStatus = async (id) => {
  try {
    const isActivo = toggleStatus(await getIndicadorStatus(id));
    const affectedRows = await Indicador.update({ activo: isActivo }, { where: { id } });
    return affectedRows > 0;
  } catch (err) {
    throw new Error(`Error al actualizar indicador: ${err.message}`);
  }
};

const getIndicadorStatus = async (id) => {
  const { activo } = await Indicador.findOne({ where: { id }, attributes: ["activo"], raw: true });
  return activo;
}

const updateIndicador = async (id, indicador) => {
  const { catalogos, ...values } = indicador;

  try {
    sequelize.transaction(async _t => {
      if (catalogos) {
        await updateOrCreateCatalogosFromIndicador(id, catalogos)
      }

      await Indicador.update(values, { where: { id } });
    })

    return;
  } catch (err) {
    throw new Error(`Error al actualizar indicador: ${err.message}`);
  }
};

const defineIncludesForIndicadores = (queryParams) => {
  return [
    ...includeBasicModels(),
    ...includeCatalogoFilters(queryParams),
  ];
};

const defineIncludesForAnIndicador = (pathway, queryParams) => {
  return [
    ...includeBasicModels(),
    ...includeCatalogoFilters(queryParams),
    ...includeHistorico(pathway),
    {
      model: Mapa,
      required: false,
      attributes: ['ubicacion', 'url']
    },
    {
      model: Formula,
      required: false,
      attributes: ['ecuacion', 'descripcion', 'isFormula'],
      include: [
        {
          model: Variable,
          required: false,
          attributes: [
            'nombre',
            'descripcion',
            'dato',
            'idUnidad',
          ],
        }
      ]
    },
  ];
}

const includeBasicModels = () => {
  return [
    {
      model: Tema,
      required: true,
      attributes: ['id', 'temaIndicador', 'descripcion', 'color', 'codigo', 'activo'],
    },
    {
      model: Dimension,
      as: 'objetivos',
      required: true,
      attributes: ['id', 'titulo'],
      through: {
        as: 'more',
        model: IndicadorObjetivo,
        attributes: ['destacado']
      }
    },
    {
      model: CatalogoDetail,
      as: 'catalogos',
      required: false,
      include: Catalogo,
      through: {
        model: CatalogoDetailIndicador,
        attributes: [],
      },
    },
  ]
};

const includeHistorico = (pathway) => {
  switch (pathway) {
    case FRONT_PATH:
      return [];
    case SITE_PATH:
      return [{
        model: Historico,
        required: false,
        attributes: ["anio", "valor", "fuente"],
        limit: 5,
        order: [["anio", "DESC"]],
      }];
    case FILE_PATH:
      return [{
        model: Historico,
        required: false,
        attributes: ["anio", "valor", "fuente"],
        order: [["anio", "DESC"]],
      }];
    default:
      throw new Error('Invalid pathway')
  };
};

const includeCatalogoFilters = (queryParams) => {
  const inIds = [];
  const { idOds, idCobertura, idUnidadMedida } = queryParams || {};
  if (idOds) {
    inIds.push(idOds);
  }
  if (idCobertura) {
    inIds.push(idCobertura);
  }
  if (idUnidadMedida) {
    inIds.push(idUnidadMedida);
  }
  if (inIds.length === 0) {
    return [];
  }

  return [{
    model: CatalogoDetail,
    required: true,
    as: 'catalogosFilters',
    attributes: ['id', 'nombre', 'idCatalogo'],
    through: {
      attributes: [],
      where: { idCatalogoDetail: [...inIds] },
    }
  }];
};

const getIdIndicadorRelatedTo = async (model, id) => {
  const indicador = await models[model].findOne({
    where: { id },
    attributes: [[sequelize.literal('"indicador"."id"'), "indicadorId"]],
    include: {
      model: Indicador,
      attributes: []
    },
    raw: true
  });
  return indicador?.indicadorId;
}

const getRandomIndicador = async (idTema) => {
  const indicadores = await Indicador.findAll({
    where: { idTema: idTema, activo: 'SI' },
    attributes: ["id"],
    raw: true
  });

  const indicadorId = indicadores[Math.floor(Math.random() * indicadores.length)];

  const indicador = await Indicador.findOne({
    where: { id: indicadorId.id },
    include: [
      {
        model: Dimension,
        as: "objetivos",
        attributes: ["titulo"]
      },
      {
        model: Tema,
        attributes: ["urlImagen"]
      }
    ],
  });

  return indicador;
}

module.exports = {
  getIndicadores,
  getIndicador,
  createIndicador,
  updateIndicador,
  updateIndicadorStatus,
  getInactiveIndicadores,
  getIdIndicadorRelatedTo,
  findAllIndicadoresInDimension,
  countIndicadoresInDimension,
  getRandomIndicador
};