const models = require('../models');
const {
  IndicadorTema,
} = models;

const updateIndicadorTemas = async (indicadorId, temas) => {
  try {
    const temasOnIndicador = await IndicadorTema.findAll({
      where: {
        idIndicador: indicadorId,
      },
      attributes: ['idTema']
    });

    const existingTemasId = temasOnIndicador.map(tema => tema.idTema);

    const temasToAdd = temas.filter(tema => !existingTemasId.includes(tema));

    const temasToDelete = existingTemasId.filter(tema => !temas.includes(tema));

    if (temasToAdd.length > 0) {
      await IndicadorTema.bulkCreate(temasToAdd.map(tema => ({
        idIndicador: indicadorId,
        idTema: tema
      })));
    }

    if (temasToDelete.length > 0) {
      await IndicadorTema.destroy({
        where: {
          idIndicador: indicadorId,
          idTema: temasToDelete
        }
      });
    }

    return true;
  } catch (err) {
    throw err;
  }
}

const assignIndicadorToTemas = async (idIndicador, idTemas) => {
  try {
    await IndicadorTema.bulkCreate(
      idTemas.map(idTema => ({ idTema, idIndicador })), {
      validate: true,
      ignoreDuplicates: true,
    })
  } catch (err) {
    throw new Error(`No se pudo asignar indicador a temas: ${err.message}`)
  }
}


module.exports = {
  updateIndicadorTemas,
  assignIndicadorToTemas
}