const { query, param, body } = require('express-validator');

const filterTemasValidationRules = () => [
    query(['searchQuery'])
        .optional()
        .trim().escape()
];

const sortTemasValidationRules = () => [
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

const createTemaValidationRules = () => [
    body('codigo')
        .exists()
        .withMessage('El codigo es obligatorio'),

    body('activo')
        .optional()
        .toUpperCase()
        .isIn(['SI', 'NO'])
        .withMessage('Estado invalido'),

    body('temaIndicador')
        .exists()
        .withMessage('El tema es obligatorio'),

    body('descripcion')
        .exists()
        .withMessage('Descripcion es obligatoria'),

    body('observaciones')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Observaciones debe tener un valor'),

    body('color')
        .optional()
        .isHexColor()
        .withMessage('Solo colores en hexadecimal')
];

const updateTemaValidationRules = () => [
    param(['idTema'])
        .exists()
        .withMessage('por favor agrega un id de Tema')
        .isInt()
        .withMessage('Field must be an integer number')
        .toInt(),

    body('codigo')
        .optional()
        .isLength({ min: 3 })
        .withMessage('El codigo debe tener 3 caracteres'),

    body('activo')
        .optional()
        .toUpperCase()
        .isIn(['SI', 'NO'])
        .withMessage('estado invalido'),

    body('temaIndicador')
        .optional()
        .isLength({ min: 5 })
        .withMessage('El tema no puede estar vacio'),

    body('descripcion')
        .exists()
        .withMessage('Descripcion es obligatoria'),

    body('observaciones')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Observaciones debe tener un valor'),

    body('color')
        .optional()
        .isHexColor()
        .withMessage('Solo colores en hexadecimal')
]

module.exports = {
    filterTemasValidationRules,
    sortTemasValidationRules,
    createTemaValidationRules,
    updateTemaValidationRules

}