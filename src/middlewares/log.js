const logger = require("../config/logger")

const logErrors = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send(err.message);
}

module.exports = logErrors;