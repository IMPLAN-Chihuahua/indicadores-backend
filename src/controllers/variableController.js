const { Variable } = require('../models');

const updateVariable = async (req, res, next) => {
  const { idVariable, ...values } = req.matchedData;
  try {
    const updatedRows = await Variable.update(values, { where: { id: idVariable } });
    return updatedRows > 0 ? res.sendStatus(204) : res.sendStatus(400);
  } catch (err) {
    next(err);
  }
}

const deleteVariable = async (req, res, next) => {
  const { idVariable } = req.matchedData;
  try {
    const destroyed = await Variable.destroy({ where: { id: idVariable } });
    return destroyed > 0 ? res.sendStatus(204) : res.sendStatus(400);
  } catch (err) {
    next(err)
  }
}

module.exports = {
  updateVariable,
  deleteVariable
}