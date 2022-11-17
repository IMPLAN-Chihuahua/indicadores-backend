const models = require('../models');

const exists = (pathId, modelName) => async (req, res, next) => {
  const id = req.matchedData[pathId];
  try {
    const result = await models[modelName].findOne({
      where: { id },
      raw: true,
      attributes: [
        [models.Sequelize.fn('COUNT', 'id'), 'count']
      ],
    })
    if (result.count > 0) {
      next();
    } else {
      return res.status(404).json({
        status: 404,
        message: `${modelName} with id ${id} was not found`
      });
    }
  } catch (err) {
    next(err)
  }
};

module.exports = { exists }