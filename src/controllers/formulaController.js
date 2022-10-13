const { getFormulaAndVariables } = require("../services/formulaService");

const getFormulaOfIndicador = async (req, res, next) => {
  try {
    const { idIndicador } = req.matchedData;
    const formula = await getFormulaAndVariables({ idIndicador });
    return res.status(200).json({ data: { ...formula?.dataValues } });
  } catch (err) {
    next(err)
  }
}

module.exports = { getFormulaOfIndicador };