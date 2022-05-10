/* eslint-disable no-restricted-syntax */
const { UsuarioIndicador, Usuario, Indicador, Sequelize } = require('../models');

const { Op } = Sequelize;

const areConnected = async (idUsuario, idIndicador) => {
  try {
    const resultset = await UsuarioIndicador.findOne({
      where: {
        idUsuario,
        idIndicador,
        activo: 'SI',
        fechaHasta: {
          [Op.gte]: Sequelize.literal('CURRENT_DATE')
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
    return resultset.count > 0;
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

module.exports = {
  areConnected,
  createRelation
}