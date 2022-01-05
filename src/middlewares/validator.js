const { check, validationResult, query, param, matchedData } = require('express-validator');

const loginValidationRules = () => {
    return [
        // correo tenga patron correcto
        check('correo')
            .isEmail()
            .withMessage('El correo tiene un formato incorrecto'),

        // valida que la clave exista y que tenga al menos 8 caracteres
        check('clave')
            .isLength({ min: 8 })
            .withMessage('La clave debe tener al menos 8 caracteres'),
    ];
};

const registerValidationRules = () => {
    return [
        // correo tenga patron correcto
        check('correo')
            .isEmail()
            .withMessage('El correo tiene un formato incorrecto'),

        // valida que la clave exista y que tenga al menos 8 caracteres
        // y que cumpla con un formato
        check('clave')
            .isLength({ min: 8 })
            .withMessage('La clave debe tener al menos 8 caracteres'),

        // nombres se encuentra en la peticion
        check('nombres')
            .exists()
            .withMessage('por favor agrega un nombre')
            .isAlpha('es-ES', { ignore: '\s' })
            .withMessage('nombre invalido'),

        // apellido paterno se encuentra en la peticion
        check('apellidopaterno')
            .exists()
            .withMessage('por favor agrega apellido paterno')
            .isAlpha('es-ES', { ignore: '\s' })
            .withMessage('apellido paterno invalido'),

        check('apellidomaterno')
            .optional()
            .isAlpha('es-ES', { ignore: '\s' })
            .withMessage('apellido materno invalido'),

        check('activo')
            .optional()
            .toUpperCase()
            .isIn(['SI', 'NO'])
            .withMessage('estado invalido')
    ];
};

const paginationValidationRules = () => {
    return [
        query(['page', 'per_page'])
            .optional()
            .isInt().withMessage('campo debe ser entero')
            .toInt()
    ];
};

const paramValidationRules = () => {
    return [
        param(["idModulo", "idIndicador"])
            .optional()
            .isInt().withMessage('Campo debe ser entero')
            .toInt()
            .custom((value) => {
                if (value < 0) {
                    throw new Error('id debe ser mayor a 0');
                }
                return true;
            })
    ];
};

// funcion que hace la validacion (hubo errores en la peticion?)
const validate = (req, res, next) => {
    const errors = validationResult(req);

    // si no hubo errores pasar a la siguiente funcion
    if (errors.isEmpty()) {
        req.matchedData = matchedData(req);
        return next();
    }

    // dar formato a errores
    const extractedErrors = [];
    errors.array().map(error => {
        extractedErrors.push({ [error.param]: error.msg });
    });

    return res.status(422).json({
        errors: extractedErrors
    });

}

module.exports = {
    loginValidationRules,
    registerValidationRules,
    paginationValidationRules,
    validate,
    paramValidationRules
};

