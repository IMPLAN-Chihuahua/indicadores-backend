/* eslint-disable no-restricted-syntax */
const { UsuarioIndicador, Sequelize } = require('../models');

const areConnected = async (idUsuario, idIndicador) => {
  try {
    const resultset = await UsuarioIndicador.findOne({
      where: {
        idUsuario,
        idIndicador,
        activo: 'SI'
      },
      attributes: [
        [Sequelize.fn('COUNT', 'id'), 'count']
      ]
    });
    return resultset.dataValues.count > 0;
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
    return UsuarioIndicador.bulkCreate(relations, { ignoreDuplicates: true });
  } catch (err) {
    throw new Error(`Error al otorgar permisos ${err.message}`);
  }
};

module.exports = {
  areConnected,
  createRelation
}