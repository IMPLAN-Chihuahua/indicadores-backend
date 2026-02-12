const { check, validationResult, query, param, matchedData, body } = require('express-validator');
const { validYear } = require('./generalValidator');

const filterIndicadoresValidationRules = () => [
    query(['anioUltimoValorDisponible', 'ods', 'cobertura', 'medida', 'idObjetivo', 'owner', 'tema'])
        .optional()
        .isInt().withMessage('Field must be an integer number')
        .toInt()
        .custom((value) => {
            if (value < 1) {
                throw new Error('valor debe ser mayor a 0');
            }
            return true;
        }),
    query('tendenciaActual')
        .optional()
        .toUpperCase()
        .isIn(['ASCENDENTE', 'DESCENDENTE', 'NO APLICA']),

    query('searchQuery')
        .optional()
        .trim(),

    query(['idObjetivos', 'objetivos.*'])
        .optional()
        .isString(),

    query('temas.*')
        .optional()
        .isInt()
        .toInt()
];


const publicFiltersRules = () => [
    query(['temas.*', 'ods.*', 'coberturas.*', 'objetivos.*'])
        .optional()
        .isInt()
        .toInt()
]

const privateFilterRules = () => [
    query(['temas.*', 'ods.*', 'coberturas.*', 'objetivos.*', 'usuarios.*',])
        .optional()
        .isInt()
        .toInt(),

    query(['idTema', 'idUsuario', 'owner'])
        .optional()
        .isInt()
        .toInt(),

    query('activo')
        .optional()
        .isBoolean()
        .toBoolean(),
    query('searchQuery')
        .optional()
        .trim()
]


const sortValidationRules = () => [
    query('sortBy')
        .optional()
        .isIn(['id', 'nombre', 'anio', 'fuente', 'valor', 'periodicidad', 'updatedAt']),
    query('order')
        .optional()
        .toUpperCase()
        .isIn(['ASC', 'DESC'])
        .withMessage('orden debe ser ascendente o descendente'),
];

const createIndicadorValidationRules = () => [
    body(['nombre', 'definicion'])
        .exists()
        .trim(),
    body('ultimoValorDisponible')
        .isDecimal()
        .toFloat(),
    body('formula.ecuacion')
        .optional()
        .trim()
        .customSanitizer(ecuacion => decodeURIComponent(ecuacion)),

    body('anioUltimoValorDisponible')
        .exists()
        .isInt()
        .custom(validYear)
        .toInt(),

    body('periodicidad')
        .isInt({ min: 1 })
        .toInt(),

    body('meses')
        .optional()
        .isArray()
        .withMessage('El campo meses debe ser un arreglo'),

    body('meses.*')
        .isInt({ min: 1, max: 12 })
        .withMessage('Cada mes debe ser un número entre 1 y 12')
        .toInt(),

    body('temas.*')
        .isInt().toInt(),

    body(['idObjetivo', 'idOds', 'idCobertura'])
        .exists()
        .isInt().toInt(),

    body('formula.isFormula')
        .optional()
        .isIn(['SI', 'NO']),

    body('formula.isFormula')
        .default('NO'),

    body('formula.variables')
        .optional()
        .isArray()
        .customSanitizer(variables => variables.map(v => {
            return typeof v === 'string' ? JSON.parse(v) : v
        })),

    body(['observaciones', 'formula.descripcion', 'historicos.*.fuente',
        'formula.variables.*.descripcion', 'formula.variables.*.nombre',
        'mapa.ubicacion', 'fuente', 'adornment', 'formula.variables.*.unidadMedida',
        'unidadMedida'])
        .optional()
        .trim(),

    body(['historicos.*.anio', 'formula.variables.*.anio'])
        .optional()
        .isNumeric()
        .custom(validYear)
        .toInt(),

    body(['historicos.*.valor'])
        .optional()
        .isNumeric()
        .toFloat(),

    body('formula.variables.*.dato')
        .optional()
        .trim(),

    body('mapa.url')
        .optional()
        .isURL(),
];

const updateIndicadorValidationRules = () => [
    body([
        'nombre',
        'adornment',
        'definicion',
        'fuente',
        'observaciones',
        'unidadMedida',
        'elif'
    ])
        .optional()
        .trim(),
    body('ultimoValorDisponible')
        .optional()
        .isNumeric()
        .toFloat(),
    body('activo')
        .optional()
        .isBoolean()
        .toBoolean(),
    body('tendenciaActual')
        .optional()
        .toUpperCase()
        .isIn(['ASCENDENTE', 'DESCENDENTE', 'NO APLICA']),
    body([
        'idOds',
        'idCobertura',
        'idObjetivo',
        'anioUltimoValorDisponible',
        'periodicidad'
    ])
        .optional()
        .isInt()
        .toInt(),
    body('temas.*.id')
        .isInt()
        .toInt()
    ,
    body('objetivos.*.id')
        .isInt()
        .toInt(),
    body('archive').optional().isBoolean(),
    body('archive').default(false),
    body('createHistoricos').optional().isBoolean().toBoolean(),
    body('createHistoricos').default(false),
    body('meses')
        .optional()
        .isArray()
        .withMessage('El campo meses debe ser un arreglo'),

    body('meses.*')
        .isInt({ min: 1, max: 12 })
        .withMessage('Cada mes debe ser un número entre 1 y 12')
        .toInt(),
];

module.exports = {
    filterIndicadoresValidationRules,
    sortValidationRules,
    createIndicadorValidationRules,
    updateIndicadorValidationRules,
    publicFiltersRules,
    privateFilterRules
};