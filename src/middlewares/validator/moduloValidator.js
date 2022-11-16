const { check, validationResult, query, param, matchedData, body } = require('express-validator');

const filterModulosValidationRules = () => [
    query(['searchQuery'])
        .optional()
        .trim().escape()
];

const sortModulosValidationRules = () => [
    query('sortBy')
        .optional()
        .isIn(['id', 'codigo', 'temaIndicador', 'createdAt', 'updatedAt', 'urlImagen', 'color', 'observaciones', 'activo'])
        .withMessage('Valor de ordenamiento no válido con la solicitud'),
    query('order')
        .optional()
        .toUpperCase()
        .isIn(['ASC', 'DESC'])
        .withMessage('orden debe ser ascendente o descendente')
];

const createModuloValidationRules = () => [
    check('codigo')
        .exists()
        .withMessage('El codigo es obligatorio'),

    check('activo')
        .optional()
        .toUpperCase()
        .isIn(['SI', 'NO'])
        .withMessage('Estado invalido'),

    check('temaIndicador')
        .exists()
        .withMessage('El tema es obligatorio'),

    check('descripcion')
        .exists()
        .withMessage('Descripcion es obligatoria'),

    check('observaciones')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Observaciones debe tener un valor'),

    check('color')
        .optional()
        .isHexColor()
        .withMessage('Solo colores en hexadecimal')
];

const updateModuloValidationRules = () => [
    param(['idModulo'])
        .exists()
        .withMessage('por favor agrega un id de modulo')
        .isInt()
        .withMessage('Field must be an integer number')
        .toInt(),

    check('codigo')
        .optional()
        .isLength({ min: 3 })
        .withMessage('El codigo debe tener 3 caracteres'),

    check('activo')
        .optional()
        .toUpperCase()
        .isIn(['SI', 'NO'])
        .withMessage('estado invalido'),

    check('temaIndicador')
        .optional()
        .isLength({ min: 5 })
        .withMessage('El tema no puede estar vacio'),

    check('descripcion')
        .exists()
        .withMessage('Descripcion es obligatoria'),

    check('observaciones')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Observaciones debe tener un valor'),

    check('color')
        .optional()
        .isHexColor()
        .withMessage('Solo colores en hexadecimal')
]

module.exports = {
    filterModulosValidationRules,
    sortModulosValidationRules,
    createModuloValidationRules,
    updateModuloValidationRules

}