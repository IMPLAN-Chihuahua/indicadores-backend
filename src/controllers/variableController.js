const { Variable } = require('../models');
const { getIdIndicadorRelatedTo } = require('../services/indicadorService');
const { isUsuarioAssignedToIndicador } = require('../services/usuarioIndicadorService');

const updateVariable = async (req, res, next) => {
  const { idVariable, ...values } = req.matchedData;
  const rol = req.rol;
  if (rol === 'ADMIN') {
    await Variable.update(values, { where: { id: idVariable } });
    return res.sendStatus(204);
  }

  const variable = await Variable.findOne({
    where: { id: idVariable },
    attributes: ['idFormula'],
    raw: true
  })

  const idIndicador = await getIdIndicadorRelatedTo('Formula', variable.idFormula);
  const userIsAssignedToIndicador = await isUsuarioAssignedToIndicador(req.sub, idIndicador)
  if (!userIsAssignedToIndicador) {
    return res.status(403).send('No tienes permiso para realizar esta operación')
  }

  await Variable.update(values, { where: { id: idVariable } });
  return res.sendStatus(204);

}

const deleteVariable = async (req, res, next) => {
  const { idVariable } = req.matchedData;
  const rol = req.rol;

  if (rol === 'ADMIN') {
    await Variable.destroy({ where: { id: idVariable } });
    return res.sendStatus(204);
  }

  const variable = await Variable.findOne({
    where: { id: idVariable },
    attributes: ['idFormula'],
    raw: true
  })

  const idIndicador = await getIdIndicadorRelatedTo('Formula', variable.idFormula);
  const userIsAssignedToIndicador = await isUsuarioAssignedToIndicador(req.sub, idIndicador)
  if (!userIsAssignedToIndicador) {
    return res.status(403).send('No tienes permiso para realizar esta operación')
  }

  await Variable.destroy({ where: { id: idVariable } });
  return res.sendStatus(204);
}

module.exports = {
  updateVariable,
  deleteVariable
}