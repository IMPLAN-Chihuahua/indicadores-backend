const { check, validationResult, query, param, matchedData, body } = require('express-validator');

const updateHistoricoValidationRules = () => [
    param(['idHistorico'])
        .exists()
        .withMessage('por favor agrega un id de historico')
        .isInt()
        .withMessage('Field must be an integer number')
        .toInt(),

    check('valor')
        .optional()
        .isNumeric(),

    check('fuente')
        .optional()
        .trim(),

    check('anio')
        .optional()
        .isNumeric()
]

const createHistoricoValidationRules = () => [
    check('idIndicador')
        .exists()
        .withMessage('El id del indicador es obligatorio'),

    check('anio')
        .exists()
        .withMessage('El año es obligatorio')
        .isNumeric()
        .withMessage('El año debe ser un numero'),

    check('valor')
        .exists()
        .withMessage('El valor es obligatorio')
        .isNumeric()
        .withMessage('El valor debe ser un numero'),

    check('fuente')
        .exists()
        .trim(),

]

module.exports = {
    updateHistoricoValidationRules,
    createHistoricoValidationRules,
}