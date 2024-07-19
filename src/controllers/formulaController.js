const { getFormulaAndVariables } = require("../services/formulaService");
const { Formula, Variable } = require('../models');
const formulaService = require("../services/formulaService");

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
  await Formula.update(values, { where: { id: idFormula } });
  return res.sendStatus(204)
}

const createFormula = async (req, res, _next) => {
  const { idIndicador, ...values } = req.matchedData;

  const created = await formulaService.createFormula({ idIndicador, ...values });
  return res.status(201).json({ data: created });
}

const addVariablesToFormula = async (req, res, _next) => {
  const { idFormula, variables } = req.matchedData;
  const formattedVariables = variables.map(v => ({ ...v, idFormula }));
  const created = await Variable.bulkCreate(formattedVariables, { validate: true });
  return res.status(201).json({ data: created });
}

module.exports = { getFormulaOfIndicador, updateFormula, createFormula, addVariablesToFormula };