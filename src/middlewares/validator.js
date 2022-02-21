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
        check('apellidoPaterno')
            .exists()
            .withMessage('por favor agrega apellido paterno')
            .isAlpha('es-ES', { ignore: '\s' })
            .withMessage('apellido paterno invalido'),

        check('apellidoMaterno')
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
            .custom((value) => {
                if (value < 1) {
                    throw new Error('valor debe ser mayor a 0');
                }
                return true;
            }),
    ];
};

const filterIndicadoresValidationRules = () => {
    return [
        query(['anioUltimoValorDisponible', 'idOds', 'idCobertura', 'idFuente', 'idUnidadMedida'])
            .optional()
            .isInt().withMessage('campo debe ser entero')
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
            .isIn(['ASCENDENTE', 'DESCENDENTE', 'NO APLICA'])
    ];
};

const paramValidationRules = () => {
    return [
        param(['idModulo', 'idIndicador', 'idUser'])
            .optional()
            .isInt().withMessage('Campo debe ser entero')
            .toInt()
            .custom((value) => {
                if (value < 1) {
                    throw new Error('El valor del campo debe ser mayor a 0');
                }
                return true;
            }),
        param(["format"])
            .optional()
            .isIn(['csv','xlsx','pdf','json'])
            .withMessage('formato debe ser csv, xlsx, pdf o json')
    ];
};

const sortValidationRules = () => {
    return [
        query('sort_by')
            .optional()
            .isIn(['nombre'])
            .withMessage('orden debe ser ascendente o descendente'),
        query('order')
            .optional()
            .toUpperCase()
            .isIn(['ASC', 'DESC'])
            
    ];
} 

const createModuloValidationRules = () => {
    return [
        check('codigo')
            .exists()
            .withMessage('por favor agrega un codigo')
            .isLength({ min: 3 })
            .withMessage('El codigo debe tener 3 caracteres')
            .matches(/[\d]{3,}/g)
            .withMessage('El codigo debe tener numeros'),
        
        check('activo')
            .optional()
            .toUpperCase()
            .isIn(['SI', 'NO'])
            .withMessage('estado invalido'),

        check('temaIndicador')
            .exists()
            .withMessage('por favor agrega un tema')
            .isLength({ min: 5 })
            .withMessage('El tema no puede estar vacio'),
    ];
}

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
    paramValidationRules,
    filterIndicadoresValidationRules,
    sortValidationRules,
    createModuloValidationRules,
};

