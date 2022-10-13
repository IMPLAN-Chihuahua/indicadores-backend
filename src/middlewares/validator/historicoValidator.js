const { check, validationResult, query, param, matchedData, body } = require('express-validator');

const updateHistoricoValidationRules = () => [
    param(['idHistorico'])
        .exists()
        .withMessage('por favor agrega un id de historico')
        .isInt()
        .withMessage('Field must be an integer number')
        .toInt(),

    check('valor')
        .optional(),

    check('fuente')
        .optional(),
]

const createHistoricoValidationRules = () => [
    check('idIndicador')
        .exists()
        .withMessage('El id del indicador es obligatorio'),

    check('idUsuario')
        .exists()
        .withMessage('El id del usuario es obligatorio'),

    check('anio')
        .exists()
        .withMessage('El año es obligatorio')
        .isNumeric()
        .withMessage('El año debe ser un numero')
    ,

    check('valor')
        .exists()
        .withMessage('El valor es obligatorio')
        .isNumeric()
        .withMessage('El valor debe ser un numero'),

    check('fuente')
        .exists(),

]

module.exports = {
    updateHistoricoValidationRules,
    createHistoricoValidationRules,
}