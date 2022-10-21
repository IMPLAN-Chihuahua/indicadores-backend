const { check, validationResult, query, param, matchedData, body } = require('express-validator');


const indicadorAssignUsuarioValidationRules = () => [
    body('usuarios.*').isInt().toInt(),
    body(['desde', 'hasta'])
        .optional()
];

const relationAssignValidationRules = () => [
    body('relationIds.*').isInt().toInt(),
    body(['desde', 'hasta'])
        .optional()
]

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

const relationTypeValidationRules = () => [
    query('id')
        .exists()
        .isInt().toInt(),

    query('relationType')
        .optional()
        .isIn(['usuarios', 'indicadores'])
        .withMessage('relationType must be usuarios or indicadores')
]

module.exports = {
    relationAssignValidationRules,
    indicadorAssignUsuarioValidationRules,
    filterRelationValidationRules,
    sortValidationRules,
    relationTypeValidationRules
}