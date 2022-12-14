const { Variable, Formula } = require('../models');
const { validate } = require('../services/authService');
const { getIdIndicadorRelatedTo } = require('../services/indicadorService');

const updateVariable = async (req, res, next) => {
  const { idVariable, ...values } = req.matchedData;
  const rol = req.rol;
  const idUsuario = req.sub;
  try {
    const variable = await Variable.findOne({
      where: { id: idVariable },
      attributes: ['idFormula'],
      raw: true
    })
    const idIndicador = await getIdIndicadorRelatedTo(Formula, variable.idFormula);
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const updatedRows = await Variable.update(values, { where: { id: idVariable } });
        return updatedRows > 0 ? res.sendStatus(204) : res.sendStatus(400);
      },
      () => res.status(403).send('No tienes permiso para actualizar esta variable')
    )
  } catch (err) {
    next(err);
  }
}

const deleteVariable = async (req, res, next) => {
  const { idVariable } = req.matchedData;
  const rol = req.rol;
  const idUsuario = req.sub;
  try {
    const variable = await Variable.findOne({
      where: { id: idVariable },
      attributes: ['idFormula'],
      raw: true
    })
    const idIndicador = await getIdIndicadorRelatedTo(Formula, variable.idFormula);
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const destroyed = await Variable.destroy({ where: { id: idVariable } });
        return destroyed > 0 ? res.sendStatus(204) : res.sendStatus(400);
      },
      () => res.status(403).send('No tienes permiso para eliminar esta variable')
    )
  } catch (err) {
    next(err)
  }
}

module.exports = {
  updateVariable,
  deleteVariable
}