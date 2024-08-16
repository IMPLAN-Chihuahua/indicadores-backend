/* eslint-disable no-restricted-syntax */
const logger = require('../config/logger');
const { UsuarioIndicador, Usuario, Indicador, sequelize, Sequelize } = require('../models');
const { getInformation } = require('./generalServices');
const { Op } = Sequelize;

const isUsuarioAssignedToIndicador = async (idUsuario, idIndicador) => {
  try {
    const res = await UsuarioIndicador.findOne({
      where: {
        idUsuario,
        idIndicador,
        activo: 'SI',
        [Op.or]: {
          fechaHasta: {
            [Op.gte]: Sequelize.literal('CURRENT_DATE')
          },
          expires: 'NO'
        }
      },
      attributes: [
        [Sequelize.fn('COUNT', 'id'), 'count']
      ],
      include: [
        {
          model: Usuario,
          where: {
            activo: 'SI',
          },
          attributes: []
        },
        {
          model: Indicador,
          where: {
            activo: 'SI',
          },
          attributes: []
        }
      ],
      raw: true
    });
    return res.count > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createRelation = async (usuarios, indicadores, relationOptions) => {
  const relations = [];

  for (const u of usuarios) {
    for (const i of indicadores) {
      relations.push({
        idUsuario: u,
        idIndicador: i,
        ...relationOptions
      })
    }
  }
  try {
    await UsuarioIndicador.bulkCreate(
      relations,
      {
        ignoreDuplicates: true,
        validate: true,
      });
    return;
  } catch (err) {
    throw new Error(`Error al otorgar permisos ${err.message}`);
  }
};

/** Gets a list of indicadores, its owner and how many users are responsible for them */
const getUsuariosIndicadores = async (page, perPage, matchedData) => {
  try {
    const result = await UsuarioIndicador.findAndCountAll({
      include: [
        {
          model: Indicador,
          required: true,
          where: getAllRelationsFilters(matchedData),
          attributes: ['owner'],
        },
      ],
      attributes: [
        'indicador.updatedAt',
        'indicador.id',
        'indicador.nombre',
      ],
      group: [
        'indicador.id',
        'indicador.nombre',
        'indicador.owner',
        'indicador.updatedAt',
      ],
    });

    return {
      data: result.count,
    }
  } catch (err) {
    throw new Error(`Error al obtener los usuariosIndicadores: ${err.message}`);
  }
};

/** Returns a list of how many users and the information about the relation between usuarios - indicadores. Also, it returns the name of the selected indicador */
const getRelationUsers = async (limit, offset, idIndicador) => {
  try {
    const result = await UsuarioIndicador.findAndCountAll({
      limit,
      offset,
      where: {
        idIndicador,
      },
      include: [
        {
          model: Usuario,
          required: true,
          attributes: ['nombres', 'apellidoPaterno', 'apellidoMaterno'],
        },
        {
          model: Indicador,
          required: true,
          attributes: [],
        }
      ],
      attributes: [
        'id', 'idUsuario', 'fechaDesde', 'fechaHasta', 'expires', 'createdBy',
        [sequelize.literal('"indicador"."nombre"'), "indicador"],
      ],
    });
    return {
      data: result.rows,
      total: result.count,
    };

  } catch (err) {
    throw new Error(`Error al obtener los usuariosIndicadores: ${err.message}`);
  }
};

const getUsuariosThatDoesntHaveIndicador = async (idIndicador) => {
  try {
    const idUsuarios = await sequelize.query(`SELECT "idUsuario" FROM "UsuarioIndicadores" WHERE "idIndicador" = ${idIndicador};
    `, { raw: true, type: sequelize.QueryTypes.SELECT });
    const ids = idUsuarios.map(u => u.idUsuario);

    const result = await Usuario.findAll({
      where: {
        id:
        {
          [Op.notIn]: ids
        },
      },
      attributes: ['id', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'urlImagen'],
    });
    return result

  } catch (err) {
    throw new Error(`Error al obtener los usuariosIndicadores: ${err.message}`);
  }
};

const getAllRelationsFilters = (matchedData) => {
  const { searchQuery } = matchedData;
  if (searchQuery) {
    const filter = {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${searchQuery}%` } },
      ]
    }
    return filter;
  }
  return {};
};

const createRelationWithModules = async (idTema) => {
  try {
    const indicadoresID = await Indicador.findAll({
      where: {
        idTema
      },
      attributes: ['id']
    });
    return indicadoresID;
  } catch (err) {
    throw new Error(`Error al actualizar la relacion: ${err.message}`);
  }
};

const deleteRelation = async (id) => {
  try {
    await UsuarioIndicador.destroy({
      where: {
        id
      }
    });
    return;
  } catch (err) {
    throw new Error(`Error al eliminar la relacion: ${err.message}`);
  }
};

const updateRelation = async (id, options) => {
  try {
    await UsuarioIndicador.update(options, {
      where: {
        id
      }
    });
    return;
  } catch (err) {
    throw new Error(`Error al actualizar la relacion: ${err.message}`);
  }
};

const getModelSelected = async (model, options) => {
  try {
    const result = await getInformation(model, options);
    return result;
  } catch (err) {
    throw new Error(`Error al obtener la información: ${err.message}`);
  }
}

module.exports = {
  isUsuarioAssignedToIndicador,
  createRelation,
  getUsuariosIndicadores,
  getRelationUsers,
  getUsuariosThatDoesntHaveIndicador,
  deleteRelation,
  updateRelation,
  createRelationWithModules,
  getModelSelected,
}