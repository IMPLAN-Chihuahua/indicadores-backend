/* eslint-disable no-use-before-define */
const { SITE_PATH, FRONT_PATH, FILE_PATH } = require("../middlewares/determinePathway");
const {
  Indicador,
  Modulo,
  Historico,
  Mapa,
  Formula,
  Variable,
  sequelize,
  Sequelize,
  CatalogoDetail
} = require("../models");
const { toggleStatus, isObjEmpty } = require("../utils/objectUtils");

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
    throw new Error(`Error al obtener indicadores: ${err.message}`);
  }
};

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
  const attributes = ["id", "nombre", "ultimoValorDisponible",
    "anioUltimoValorDisponible", "tendenciaActual", "fuente", "createdBy", "updatedAt"];

  switch (pathway) {
    case FILE_PATH:
      attributes.push("definicion", "urlImagen")
      return attributes;
    case SITE_PATH:
      if (matchedData) {
        attributes.push("createdAt", "updatedAt", "idModulo")
      } else {
        attributes.push("definicion", "urlImagen")
      }
      return attributes;
    case FRONT_PATH:
      attributes.push(
        "urlImagen",
        "definicion",
        "codigo",
        "codigoObjeto",
        "observaciones",
        "createdBy",
        "updatedBy",
        "idModulo",
        "createdAt",
        "updatedAt",
        "activo")
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
        idModulo: matchedData.idModulo,
        ...filterIndicadorBy(matchedData),
      };
      break;
    case FRONT_PATH:
      where = {
        ...getIndicadoresFilters(matchedData)
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
    const indicador = await Indicador.findOne({
      where: { id: idIndicador, },
      include: includes,
      attributes,
    });
    if (pathway !== FILE_PATH || indicador === null) {
      return indicador;
    }
    return { ...indicador.dataValues };
  } catch (err) {
    throw new Error(`Error al obtener indicador ${idIndicador}\n${err.message}`)
  }
};

const getIndicadoresFilters = (matchedData) => {
  const { searchQuery } = matchedData;
  if (searchQuery) {
    const filter = {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${searchQuery}%` } },
        { definicion: { [Op.iLike]: `%${searchQuery}%` } },
        { codigo: { [Op.iLike]: `%${searchQuery}%` } },
        { codigoObjeto: { [Op.iLike]: `%${searchQuery}%` } },
        { tendenciaActual: { [Op.iLike]: `%${searchQuery}%` } },
        { observaciones: { [Op.iLike]: `%${searchQuery}%` } },
      ]
    };
    return filter;
  }
  return {};
};

const filterIndicadorBy = (matchedData) => {
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

const getIncludesToCreateIndicador = (indicador) => {
  const includes = [];
  if (indicador.formula) {
    includes.push({
      association: Indicador.associations.formula,
      include: [Formula.associations.variables]
    });
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
      ...getIncludesToCreateIndicador(indicador), transaction: t
    });

    await t.commit();
    return createdIndicador;

  } catch (err) {
    await t.rollback();
    throw new Error(`Error al crear indicador: ${err.message}`);
  }
};


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
  try {
    const affectedRows = await Indicador.update({ ...indicador }, { where: { id } });
    return affectedRows > 0;
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
    ...includeHistorico(pathway)
  ];
}

const includeBasicModels = () => {
  return [
    {
      model: Modulo,
      required: true,
      attributes: ['id', 'temaIndicador', 'descripcion', 'color'],
    },
    {
      model: Mapa,
      required: false,
      attributes: ['ubicacion', 'url']
    },
    {
      model: Formula,
      required: false,
      attributes: ['ecuacion', 'descripcion'],
      include: [
        {
          model: Variable,
          required: false,
          attributes: [
            'nombre',
            'nombreAtributo',
            'dato',
          ],
        }
      ]
    },
    {
      model: CatalogoDetail,
      required: false,
      as: 'catalogos',
      attributes: ['id', 'nombre', 'idCatalogo'],
      through: {
        attributes: [],
      },
    },
  ]
};

const includeHistorico = (pathway) => {
  switch (pathway) {
    case FRONT_PATH:
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
}

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
}

module.exports = {
  getIndicadores,
  getIndicador,
  createIndicador,
  updateIndicador,
  updateIndicadorStatus,
};