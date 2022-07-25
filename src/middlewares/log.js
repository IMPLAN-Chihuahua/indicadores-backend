const logger = require("../config/logger")

const logErrors = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({status: 500, message: err.message});
}

module.exports = logErrors;