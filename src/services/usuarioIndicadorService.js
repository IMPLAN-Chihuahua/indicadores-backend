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

const assignUsuariosToIndicador = async (relation) => {
  const { idIndicador, desde, hasta, createdBy, updatedBy, usuarios } = relation;
  try {
    const relations = usuarios.map(idUsuario => ({
      idUsuario,
      idIndicador,
      fechaDesde: desde,
      fechaHasta: hasta,
      createdBy,
      updatedBy
    }));
    return UsuarioIndicador.bulkCreate(relations, { ignoreDuplicates: true, validate: true });
  } catch (err) {
    throw new Error(`Error al asignar usuarios a indicador ${err.message}`);
  }
};

module.exports = {
  areConnected,
  assignUsuariosToIndicador
}