const { query, param, body } = require('express-validator');

const searchQueryValidationRules = () => [
    query('searchQuery')
        .optional()
        .trim().escape(),
    query('searchQuery')
        .default('')
];


const filterPrivateTemasValidationRules = () => [
    query('activo')
        .optional()
        .isBoolean()
        .toBoolean()
]

const sortTemasValidationRules = () => [
    query('sortBy')
        .optional()
        .isIn(['id', 'codigo', 'temaIndicador', 'createdAt', 'updatedAt', 'urlImagen', 'color', 'observaciones', 'activo'])
        .withMessage('Valor de ordenamiento no válido con la solicitud'),
    query('sortBy')
        .default('id'),
    query('order')
        .optional()
        .toUpperCase()
        .isIn(['ASC', 'DESC'])
        .withMessage('orden debe ser ascendente o descendente'),
    query('order')
        .default('ASC'),
];

const sortPublictemasValidationRules = () => [
    query('sortBy')
        .optional()
        .isIn(['temaIndicador', 'createdAt'])
        .withMessage('Valor de ordenamiento no válido con la solicitud'),
    query('sortBy')
        .default('id'),
    query('order')
        .optional()
        .toUpperCase()
        .isIn(['ASC', 'DESC'])
        .withMessage('orden debe ser ascendente o descendente'),
    query('order')
        .default('ASC'),
]

const createTemaValidationRules = () => [
    body('codigo')
        .exists()
        .withMessage('El codigo es obligatorio'),

    body('activo')
        .optional()
        .isBoolean()
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
        .isLength({ min: 1 })
        .withMessage('El código debe tener 2 caracteres'),

    body('activo')
        .optional()
        .isBoolean()
        .withMessage('Estado invalido'),

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
    searchQueryValidationRules,
    sortTemasValidationRules,
    createTemaValidationRules,
    updateTemaValidationRules,
    filterPrivateTemasValidationRules,
    sortPublictemasValidationRules
}