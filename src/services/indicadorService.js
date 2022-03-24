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

const getIndicadores = async (page, perPage, matchedData, pathway) => {
  const { where, order, attributes, includes } = definitions(pathway, matchedData);
  try {
    const result = await Indicador.findAndCountAll({
      where: where,
      order: order,
      include: includes,
      attributes: attributes,
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    return { indicadores: result.rows, total: result.count };
  } catch (err) {
    throw new Error(`Error al obtener los indicadores: ${err.message}`);
  }
};

const getIndicador = async (idIndicador, pathway) => {
  const includes = defineIncludes(pathway);
  const attributes = defineAttributes(pathway);
  const indicador = await Indicador.findOne({
    where: { id: idIndicador, },
    include: includes,
    attributes: attributes,
  });

  if (typeof pathway !== 'file' || indicador === null) {
    return indicador;
  }
  return { ...indicador.dataValues };
};

const getIndicadoresFilters = (matchedData) => {
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
const getIndicadoresSorting = ({ sortBy, order }) => {
  const arrangement = [];
  arrangement.push([sortBy || "id", order || "ASC"]);
  return arrangement;
};

// Includes for inner join to filter list 
const getIndicadorIncludes = ({ idFuente }) => {
  const indicadorFilter = [];

  indicadorFilter.push(
    {
      model: Ods,
      required: true,
      attributes: []
    },
    {
      model: CoberturaGeografica,
      required: true,
      attributes: []
    },
    {
      model: UnidadMedida,
      required: true,
      attributes: []
    },
  );

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

const defineAttributes = (pathway, matchedData) => {
  let attributes = [];
  switch (pathway) {
    case 'file': {
      attributes.push(
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
        "tendenciaDeseada")
      return attributes;
    };
    case 'site': {
      if (matchedData) {
        attributes.push(
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
          "idModulo")
      } else {
        attributes.push(
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
          "tendenciaDeseada")
      }
      return attributes;
    };
    case 'front': {
      attributes.push(
        "id",
        "nombre",
        "urlImagen",
        "definicion",
        "codigo",
        "codigoObjeto",
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
        "createdBy",
        "updatedBy",
        "activo",
        "idModulo")
      return attributes;
    };
  }
};

const defineIncludes = (pathway, matchedData) => {
  let includes = [
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
    },
  ];
  switch (pathway) {
    case 'front': {
      if (typeof matchedData != 'undefined') {
        includes = [];
        includes = getIndicadorIncludes(matchedData);
      } else {
        includes.push({
          model: Historico,
          required: true,
          attributes: ["anio", "valor", "fuente"],
          limit: 5,
          order: [["anio", "DESC"]],
        });
      };
      return includes;
    };
    case 'file': {
      includes.push({
        model: Historico,
        required: false,
        attributes: ["anio", "valor", "fuente"],
        order: [["anio", "DESC"]],
      });
      return includes;
    };
    case 'site': {
      if (typeof matchedData != 'undefined') {
        includes = [];
        includes = getIndicadorIncludes(matchedData);
      } else {
        includes.push({
          model: Historico,
          required: true,
          attributes: ["anio", "valor", "fuente"],
          limit: 5,
          order: [["anio", "DESC"]],
        });
      }
      return includes;
    };
  };
};

const defineOrder = (pathway, matchedData) => {
  let order = [];
  switch (pathway) {
    case 'site': {
      order.push(getIndicadoresSorting(matchedData))
    };
      return order;
    case 'front': {
      order.push(getIndicadoresSorting(matchedData))
    };
      return order;
  };
  return order;
};

const defineWhere = (pathway, matchedData) => {
  let where = {};
  switch (pathway) {
    case 'site': {
      where = {
        idModulo: matchedData.idModulo,
        ...validateCatalog(matchedData),
        ...getIndicadorFilters(matchedData),
      };
      return where;
    }
    case 'front': {
      where = {
        ...getIndicadoresFilters(matchedData)
      }
      return where;
    };
  }
  return where;
};

const definitions = (pathway, matchedData) => {
  const attributes = defineAttributes(pathway, matchedData);
  const includes = defineIncludes(pathway, matchedData);
  const order = defineOrder(pathway, matchedData);
  const where = defineWhere(pathway, matchedData);

  const definitions = {
    attributes,
    includes,
    order,
    where,
  };

  return definitions;
};

module.exports = {
  getIndicadores,
  getIndicador,
  createIndicador,
  updateIndicador,
};