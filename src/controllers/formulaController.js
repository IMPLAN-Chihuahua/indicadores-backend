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
  try {
    const { idFormula, ...values } = req.matchedData;
    const updatedRows = await Formula.update(values, { where: { id: idFormula } });
    return updatedRows > 0 ? res.sendStatus(204) : res.sendStatus(400);
  } catch (err) {
    next(err)
  }
}

const createFormula = async (req, res, next) => {
  // TODO: Add validation if user is related to indicador
  try {
    const values = req.matchedData;
    const created = await formulaService.createFormula(values);
    if (created) {
      return res.status(201).json({ data: created })
    } else {
      return res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
}

const addVariablesToFormula = async (req, res, next) => {
  try {
    const { idFormula, variables } = req.matchedData;
    const formattedVariables = variables.map(v => ({ ...v, idFormula }))
    const created = await Variable.bulkCreate(formattedVariables, { validate: true });
    return created ? res.status(201).json({ data: created }) : res.status(400);
  } catch (err) {
    next(err)
  }
}

module.exports = { getFormulaOfIndicador, updateFormula, createFormula, addVariablesToFormula };