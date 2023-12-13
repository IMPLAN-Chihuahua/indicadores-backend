const { body } = require("express-validator");


const mapaValidationRules = () => [
  body('url')
    .isURL(),

  body('ubicacion')
    .trim()
];


module.exports = { mapaValidationRules };