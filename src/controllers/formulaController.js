const { getFormulaAndVariables } = require("../services/formulaService");
const { Formula, Variable } = require('../models');
const formulaService = require("../services/formulaService");
const { getIdIndicadorRelatedTo } = require("../services/indicadorService");
const { validate } = require("../services/authService");

const getFormulaOfIndicador = async (req, res, next) => {
  try {
    const { idIndicador } = req.matchedData;
    const formula = await getFormulaAndVariables({ idIndicador });
    return res.status(200).json({ data: { ...formula?.dataValues } });
  } catch (err) {
    next(err)
  }
}

const updateFormula = async (req, res, next) => {
  const { idFormula, ...values } = req.matchedData;
  const idUsuario = req.sub;
  const rol = req.rol;
  try {
    const idIndicador = await getIdIndicadorRelatedTo(Formula, idFormula);
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const updatedRows = await Formula.update(values, { where: { id: idFormula } });
        return updatedRows > 0 ? res.sendStatus(204) : res.sendStatus(400);
      },
      () => res.status(403).send('No tienes permiso para actualizar esta formula')
    )
  } catch (err) {
    next(err)
  }
}

const createFormula = async (req, res, next) => {
  const { idIndicador, ...values } = req.matchedData;
  const idUsuario = req.sub;
  const rol = req.rol;
  try {
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const created = await formulaService.createFormula(values);
        return created ? res.status(201).json({ data: created }) : res.status(400);
      },
      () => res.status(403).send('No tienes permiso para agregar la formula al indicador')
    )
  } catch (err) {
    next(err);
  }
}

const addVariablesToFormula = async (req, res, next) => {
  const { idFormula, variables } = req.matchedData;
  const idUsuario = req.sub;
  const rol = req.rol;
  try {
    const idIndicador = await getIdIndicadorRelatedTo(Formula, idFormula);
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const formattedVariables = variables.map(v => ({ ...v, idFormula }))
        const created = await Variable.bulkCreate(formattedVariables, { validate: true });
        return created ? res.status(201).json({ data: created }) : res.status(400);
      },
      () => res.status(403).send('No tienes permiso para agregar variables a esta formula')
    )
  } catch (err) {
    next(err);
  }
}

module.exports = { getFormulaOfIndicador, updateFormula, createFormula, addVariablesToFormula };