const { check, validationResult, query } = require('express-validator');

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
            .withMessage('por favor agrega un nombre'),

        // apellido paterno se encuentra en la peticion
        check('apellidopaterno')
            .exists()
            .withMessage('por favor agrega apellido paterno'),

        // 
    ];
};

const paginationValidationRules = () => {
    return [
        query('page')
            .optional()
            .isInt()
            .withMessage('page debe ser entero'),
        query('per_page')
            .optional()
            .isInt()
            .withMessage('per_page debe ser entero'),
    ];
}


// funcion que hace la validacion (hubo errores en la peticion?)
const validate = (req, res, next) => {
    const errors = validationResult(req);

    // si no hubo errores pasar a la siguiente funcion
    if (errors.isEmpty()) {
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
}