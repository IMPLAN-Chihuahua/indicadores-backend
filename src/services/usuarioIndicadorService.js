const { UsuarioIndicador, Sequelize } = require('../models');

const areConnected = async (idUser, idIndicador) => {
  try {
    const resultset = await UsuarioIndicador.findOne({
      where: {
        idUsuario: idUser,
        idIndicador: idIndicador,
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

module.exports = {
  areConnected
}