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
    param(['idModulo', 'idIndicador', 'idUser', 'idOds', 'idCobertura', 'idUnidadMedida', 'idCatalogo', 'idHistorico'])
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

module.exports = {
    paginationValidationRules,
    paramValidationRules,
    validYear,
    validate,
}