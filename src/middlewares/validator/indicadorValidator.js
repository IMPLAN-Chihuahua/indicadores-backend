const { check, validationResult, query, param, matchedData, body } = require('express-validator');
const { validYear } = require('./generalValidator');

const filterIndicadoresValidationRules = () => [
    query(['anioUltimoValorDisponible', 'idOds', 'idCobertura', 'idUnidadMedida', 'idDimension', 'owner'])
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
        .optional(),

    query('idDimensions')
        .optional()
        .isString()
];

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
    body(['nombre', 'codigo', 'definicion', 'ultimoValorDisponible'])
        .exists()
        .trim(),

    body('formula.ecuacion')
        .optional()
        .trim()
        .customSanitizer(ecuacion => decodeURIComponent(ecuacion)),

    body('anioUltimoValorDisponible')
        .exists()
        .isNumeric()
        .custom(validYear)
        .toInt(),

    body('idModulo')
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
        'mapa.ubicacion', 'fuente'])
        .optional()
        .trim(),

    body('periodicidad')
        .optional()
        .isInt({ min: 1 })
        .toInt(),

    body(['historicos.*.anio', 'formula.variables.*.anio'])
        .optional()
        .isNumeric()
        .custom(validYear)
        .toInt(),

    body(['catalogos.*', 'formula.variables.*.idUnidad'])
        .isNumeric()
        .toInt(),

    body(['historicos.*.valor', 'formula.variables.*.dato',])
        .optional()
        .isNumeric()
        .toFloat(),

    body('mapa.url')
        .optional()
        .isURL(),
];

const updateIndicadorValidationRules = () => [
    body(['codigo', 'codigoObjeto'])
        .optional()
        .isLength({ max: 3 })
        .matches(/\d{3}$/),
    body(['activo', 'definicion', 'fuente', 'nombre', 'observaciones', 'owner', 'periodicidad', 'ultimoValorDisponible', 'updatedBy'])
        .optional()
        .trim(),
    body('tendenciaActual')
        .optional()
        .toUpperCase()
        .isIn(['ASCENDENTE', 'DESCENDENTE']),
    body(['idOds', 'idCobertura',
        'idUnidadMedida', 'idModulo', 'idDimension',
        'anioUltimoValorDisponible'])
        .optional()
        .isInt().toInt(),

    body('archive').optional().isBoolean(),
    body('archive').default(false)
];

module.exports = {
    filterIndicadoresValidationRules,
    sortValidationRules,
    createIndicadorValidationRules,
    updateIndicadorValidationRules
};