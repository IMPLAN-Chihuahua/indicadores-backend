const { body } = require("express-validator");


const mapaValidationRules = () => [
  body('url')
    .isURL(),

  body('ubicacion')
    .optional()
    .trim()
    .notEmpty(),
];


module.exports = { mapaValidationRules };