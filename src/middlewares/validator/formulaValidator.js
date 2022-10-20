const { body } = require("express-validator");
const { createVariableValidationRules, variablesChain } = require("./variableValidator");

const updateValidationRules = () => [
  body('ecuacion')
    .optional()
    .trim()
    .customSanitizer(ecuacion => decodeURIComponent(ecuacion)),

  body('descripcion')
    .optional()
    .trim(),

  body('isFormula')
    .optional()
    .toUpperCase()
    .isIn(['SI', 'NO'])
    .withMessage('estado invalido')
];

const createFormulaValidationRules = () => [
  ...updateValidationRules(), 
  variablesChain().optional(),
  ...createVariableValidationRules()
];

module.exports = { updateValidationRules, createFormulaValidationRules }