const { check, validationResult, query, param, matchedData, body } = require('express-validator');

const paginationValidationRules = () => [
    query(['page', 'perPage'])
        .optional()
        .isInt().withMessage('Field must be an integer number')
        .toInt()
        .custom((value) => {
            if (value < 1) {
                throw new Error('valor debe ser mayor a 0');
            }
            return true;
        }),
];

const paramValidationRules = () => [
    param(['idModulo', 'idIndicador', 'idUser', 'idOds', 'idCobertura',
        'idUnidadMedida', 'idCatalogo', 'idHistorico', 'idFormula', 'idRelacion'])
        .optional()
        .isInt().withMessage('Field must be an integer number')
        .toInt()
        .custom((value) => {
            if (value < 1) {
                throw new Error('El valor del campo debe ser mayor a 0');
            }
            return true;
        }),
    param(["format"])
        .optional()
        .isIn(['csv', 'xlsx', 'pdf', 'json'])
        .withMessage('formato debe ser csv, xlsx, pdf o json'),
];

const validYear = (year) => year <= new Date().getFullYear();

const errorFormatter = ({ location, msg, param: paramFormatter }) => `${location}[${paramFormatter}]: ${msg}`

const validate = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (errors.isEmpty()) {
        req.matchedData = matchedData(req);
        return next();
    }

    return res.status(422).json({
        status: 422,
        errors: errors.array({ onlyFirstError: true })
    });

};

const generalFilterOptions = () => [
    //Allow attributes query, if only one attribute is passed, it will be converted to an array
    query('attributes')
        .optional()
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                return [value];
            }
            return value;
        }),
    query('id')
        .optional()
        .isInt().withMessage('Field must be an integer number')
        .toInt()
        .custom((value) => {
            if (value < 1) {
                throw new Error('El valor del campo debe ser mayor a 0');
            }
            return true;
        }),

];

const generalSortValidationRules = () => [
    query('sortBy')
        .optional()
        .isString().withMessage('Parámetro debe ser una cadena de texto')
    ,

    query('order')
        .optional()
        .toUpperCase()
        .isIn(['ASC', 'DESC'])
        .withMessage('Parámetro de ordenamiento debe ser ASC o DESC.')
];

const idValidation = () => {
    return param(['idModulo', 'idIndicador', 'idUser', 'idOds', 'idCobertura',
        'idUnidadMedida', 'idCatalogo', 'idHistorico', 'idFormula', 'idVariable'])
        .optional()
        .isInt().withMessage('Field must be an integer number').bail()
        .toInt()
        .custom((value) => {
            if (value < 1) {
                throw new Error('Value must be greater than 0');
            }
            return true;
        })
}

const formatDocsValidation = () => {
    return param(["format"])
        .isIn(['csv', 'xlsx', 'pdf', 'json'])
        .withMessage('formato debe ser csv, xlsx, pdf o json')
}


const joinRules = (...rules) => [rules]

module.exports = {
    paginationValidationRules,
    paramValidationRules,
    validYear,
    validate,
    idValidation,
    joinRules,
    formatDocsValidation,
    generalFilterOptions,
    generalSortValidationRules,
}