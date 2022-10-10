const { check, validationResult, query, param, matchedData, body } = require('express-validator');

const loginValidationRules = () => [
  check('correo')
    .isEmail()
    .withMessage('El correo tiene un formato incorrecto'),

  check('clave')
    .isLength({ min: 8 })
    .withMessage('La clave debe tener al menos 8 caracteres'),
];

const registerValidationRules = () => [
  body('correo')
    .isEmail()
    .withMessage('El correo tiene un formato incorrecto'),

  body('clave')
    .isLength({ min: 8 })
    .withMessage('La clave debe tener al menos 8 caracteres'),

  body('nombres')
    .exists()
    .withMessage('por favor agrega un nombre')
    .isAlpha('es-ES', { ignore: '\s' })
    .withMessage('nombre invalido'),

  body('apellidoPaterno')
    .exists()
    .withMessage('por favor agrega apellido paterno')
    .isAlpha('es-ES', { ignore: '\s' })
    .withMessage('apellido paterno invalido'),

  body('apellidoMaterno')
    .optional()
    .isAlpha('es-ES', { ignore: '\s' })
    .withMessage('apellido materno invalido'),

  body('activo')
    .optional()
    .toUpperCase()
    .isIn(['SI', 'NO'])
    .withMessage('estado invalido'),

  body('idRol')
    .exists('El rol es un campo requerido')
    .isInt('El rol debe ser entero')
    .toInt()
];

const updateValidationRules = () => [
  check('correo')
    .optional()
    .isEmail()
    .withMessage('El correo tiene un formato incorrecto'),

  check('clave')
    .optional()
    .isLength({ min: 8 })
    .withMessage('La clave debe tener al menos 8 caracteres'),

  check('nombres')
    .optional()
    .isAlpha('es-ES', { ignore: '\s' })
    .withMessage('nombre invalido'),

  check('apellidoPaterno')
    .optional()
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
    .withMessage('estado invalido'),

  check('descripcion')
    .optional()
    .isLength({ min: 1 })
    .withMessage('descripcion debe tener al menos 1 caracter'),

]

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

const filterIndicadoresValidationRules = () => [
  query(['anioUltimoValorDisponible', 'idOds', 'idCobertura', 'idUnidadMedida'])
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
    .isIn(['Ascendente', 'Descendente', 'No aplica']),
  query('searchQuery')
    .optional()
];


const filterModulosValidationRules = () => [
  query(['searchQuery'])
    .optional()
    .trim().escape()
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

const sortValidationRules = () => [
  query('sortBy')
    .optional()
    .isIn(['id', 'nombre', 'anio', 'fuente', 'valor', 'periodicidad'])
    .withMessage('orden debe ser ascendente o descendente'),
  query('order')
    .optional()
    .toUpperCase()
    .isIn(['ASC', 'DESC'])

];

const tokenValidationRules = () => [
  param(["token"])
    .optional()
    .isLength({ min: 1 })
    .withMessage('token debe tener al menos 1 caracter')
    .isJWT('Token debe tener un formato valido'),
];

const sortModulosValidationRules = () => [
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

const createModuloValidationRules = () => [
  check('codigo')
    .exists()
    .withMessage('El codigo es obligatorio'),

  check('activo')
    .optional()
    .toUpperCase()
    .isIn(['SI', 'NO'])
    .withMessage('Estado invalido'),

  check('temaIndicador')
    .exists()
    .withMessage('El tema es obligatorio'),

  check('descripcion')
    .exists()
    .withMessage('Descripcion es obligatoria'),

  check('observaciones')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Observaciones debe tener un valor'),

  check('color')
    .optional()
    .isHexColor()
    .withMessage('Solo colores en hexadecimal')
];

const updateModuloValidationRules = () => [
  param(['idModulo'])
    .exists()
    .withMessage('por favor agrega un id de modulo')
    .isInt()
    .withMessage('Field must be an integer number')
    .toInt(),

  check('codigo')
    .optional()
    .isLength({ min: 3 })
    .withMessage('El codigo debe tener 3 caracteres'),

  check('activo')
    .optional()
    .toUpperCase()
    .isIn(['SI', 'NO'])
    .withMessage('estado invalido'),

  check('temaIndicador')
    .optional()
    .isLength({ min: 5 })
    .withMessage('El tema no puede estar vacio'),
]

const updateHistoricoValidationRules = () => [
  param(['idHistorico'])
    .exists()
    .withMessage('por favor agrega un id de historico')
    .isInt()
    .withMessage('Field must be an integer number')
    .toInt(),

  check('valor')
    .optional(),

  check('fuente')
    .optional(),
]

const validYear = (year) => year <= new Date().getFullYear();

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
    .isURL()
];

const updateIndicadorValidationRules = () => [
  body(['nombre', 'definicion', 'ultimoValorDisponible',
    'observaciones', 'codigo'])
    .optional()
    .trim().escape(),
  body(['tendenciaActual', 'tendenciaDeseada'])
    .optional()
    .toUpperCase()
    .isIn(['ASCENDENTE', 'DESCENDENTE']),
  body(['idOds', 'idCobertura',
    'idUnidadMedida', 'idModulo',
    'anioUltimoValorDisponible'])
    .optional()
    .isInt().toInt()
];

const indicadorAssignUsuarioValidationRules = () => [
  body('usuarios.*').isInt().toInt(),
  body(['desde', 'hasta']).isISO8601()
];

const usuarioAssignIndicadorValidationRules = () => [
  body('indicadores.*').isInt().toInt(),
  body(['desde', 'hasta']).isISO8601()
]

const desdeHastaDateRangeValidationRules = () => [
  check('hasta').custom((value, { req }) => {
    if (new Date(value) < new Date(req.body.desde)) {
      throw new Error("Fecha 'hasta' debe ser mayor a fecha 'desde'")
    }
    return true;
  }),
];

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

}

module.exports = {
  validate,
  loginValidationRules,
  registerValidationRules,
  updateValidationRules,
  paginationValidationRules,
  paramValidationRules,
  filterIndicadoresValidationRules,
  sortValidationRules,
  createModuloValidationRules,
  updateModuloValidationRules,
  createIndicadorValidationRules,
  filterModulosValidationRules,
  sortModulosValidationRules,
  updateIndicadorValidationRules,
  updateHistoricoValidationRules,
  tokenValidationRules,
  indicadorAssignUsuarioValidationRules,
  usuarioAssignIndicadorValidationRules,
  desdeHastaDateRangeValidationRules,
};

