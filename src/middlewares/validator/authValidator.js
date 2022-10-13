const { check, validationResult, query, param, matchedData, body } = require('express-validator');

const loginValidationRules = () => [
    check('correo')
        .isEmail()
        .withMessage('El correo tiene un formato incorrecto'),

    check('clave')
        .isLength({ min: 8 })
        .withMessage('La clave debe tener al menos 8 caracteres'),
];

const tokenValidationRules = () => [
    param(["token"])
        .optional()
        .isLength({ min: 1 })
        .withMessage('token debe tener al menos 1 caracter')
        .isJWT('Token debe tener un formato valido'),
];

module.exports = {
    loginValidationRules,
    tokenValidationRules,
};

