const { check, validationResult, query, param, matchedData, body } = require('express-validator');


const indicadorAssignUsuarioValidationRules = () => [
    body('usuarios.*').isInt().toInt(),
    body(['desde', 'hasta']).isISO8601()
];

const usuarioAssignIndicadorValidationRules = () => [
    body('indicadores.*').isInt().toInt(),
    body(['desde', 'hasta']).isISO8601()
]

const desdeHastaDateRangeValidationRules = () => [
    check('hasta').custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.desde)) {
            throw new Error("Fecha 'hasta' debe ser mayor a fecha 'desde'")
        }
        return true;
    }),
];

const filterRelationValidationRules = () => [
    query('searchQuery')
        .optional()
];

const sortValidationRules = () => [
    query('sort')
        .optional()
        .isIn(['id', 'idUsuario', 'idIndicador', 'desde', 'hasta'])
        .withMessage('sort must be id, idUsuario, idIndicador, desde, hasta'),
    query('order')
        .optional()
        .toUpperCase()
        .isIn(['ASC', 'DESC'])
        .withMessage('order must be asc or desc'),
]

module.exports = {
    indicadorAssignUsuarioValidationRules,
    usuarioAssignIndicadorValidationRules,
    desdeHastaDateRangeValidationRules,
    filterRelationValidationRules,
    sortValidationRules
}