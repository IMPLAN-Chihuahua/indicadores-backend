const { Formula, Variable } = require('../models');

/**
 * @returns formula and variables:
 *  - with a known formula id
 *  - from an indicador (formula of an indicador)
 */
const getFormulaAndVariables = async (where) => {
  const { idFormula, idIndicador } = where;
  try {
    return await Formula.findOne({
      where: {
        ...(idFormula && { id: idFormula }),
        ...(idIndicador && { idIndicador }),
      },
      include: {
        model: Variable
      }
    });
  } catch (err) {
    throw err;
  }
}

module.exports = { getFormulaAndVariables }