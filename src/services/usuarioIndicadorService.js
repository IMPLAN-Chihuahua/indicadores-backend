/* eslint-disable no-restricted-syntax */
const { UsuarioIndicador, Usuario, Indicador, sequelize } = require('../models');

const { Op } = sequelize;

const areConnected = async (idUsuario, idIndicador) => {
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

const createRelation = async (usuarios, indicadores, options) => {
  const relations = [];

  for (const u of usuarios) {
    for (const i of indicadores) {
      relations.push({
        idUsuario: u,
        idIndicador: i,
        ...options
      })
    }
  }
  try {
    await UsuarioIndicador.bulkCreate(relations, { ignoreDuplicates: true, validate: true });
    return;
  } catch (err) {
    throw new Error(`Error al otorgar permisos ${err.message}`);
  }
};

const getUsuariosIndicadores = async (page, perPage, order, sortBy) => {
  try {
    const result = await UsuarioIndicador.findAndCountAll({
      include: [
        {
          model: Indicador,
          required: true,
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
      total: result.rows,
      data: result.count,
    }
  } catch (err) {
    throw new Error(`Error al obtener los usuariosIndicadores: ${err.message}`);
  }
}


module.exports = {
  areConnected,
  createRelation,
  getUsuariosIndicadores
}