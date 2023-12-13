const { check, validationResult, query, param, matchedData, body } = require('express-validator');

const updateIndicadorCatalogos = () => [
    body('idIndicador')
        .exists()
        .withMessage('El id del indicador es obligatorio')
        .isInt()
        .withMessage('El id del indicador debe ser un numero')
        .toInt(),

    body('catalogos.*')
        .exists()
        .withMessage('El catalogo es obligatorio')
]

module.exports = {
    updateIndicadorCatalogos,
}