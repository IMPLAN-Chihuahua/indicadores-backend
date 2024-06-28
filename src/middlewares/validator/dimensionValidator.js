const { query, param, body } = require('express-validator');


const updateDimensionValidationRules = () => [
    param(['idDimension'])
        .exists()
        .withMessage('por favor agrega un id de dimension')
        .isInt()
        .withMessage('Field must be an integer number')
        .toInt(),

    body('titulo')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Titulo debe tener un valor'),

    body('descripcion')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Descripcion debe tener un valor'),

    body('color')
        .optional()
        .isHexColor()
        .withMessage('Solo colores en hexadecimal')
]

module.exports = {
    updateDimensionValidationRules
}