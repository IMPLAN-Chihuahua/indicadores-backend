const {
  indicadorAssignUsuarioValidationRules
} = require('../middlewares/validator/usuarioIndicadorValidator')
const {
  filterIndicadoresValidationRules,
  sortValidationRules,
  createIndicadorValidationRules,
  updateIndicadorValidationRules,
} = require('../middlewares/validator/indicadorValidator')
const {
  paginationValidationRules,
  paramValidationRules,
  validate,
  idValidation,
  generalFilterOptions,
  generalSortValidationRules,
} = require('../middlewares/validator/generalValidator')
const {
  getIndicador,
  getIndicadores,
  createIndicador,
  updateIndicador,
  updateIndicadorStatus,
  getUsersFromIndicador,
} = require('../controllers/indicadorController');
const { verifyJWT, verifyUserHasRoles, verifyUserIsActive } = require('../middlewares/auth');
const { determinePathway, SITE_PATH, FRONT_PATH, determineModel } = require('../middlewares/determinePathway');
const { uploadImage } = require('../middlewares/fileUpload');
const { getCatalogosFromIndicador, updateOrCreateCatalogFromIndicador } = require('../controllers/catalogoController');
const { DESTINATIONS } = require('../services/fileService');
const { getFormulaOfIndicador, createFormula } = require('../controllers/formulaController');
const { exists } = require('../middlewares/resourceExists');
const { createFormulaValidationRules } = require('../middlewares/validator/formulaValidator');
const { createRelationUI } = require('../controllers/usuarioIndicadorController');
const { getInformation } = require('../controllers/generalController');
const { getMapaOfIndicador, createMapa } = require('../controllers/mapaController');
const { mapaValidationRules } = require('../middlewares/validator/mapaValidator');

const express = require('express');
const { getHistoricos, createHistorico } = require('../controllers/historicoController');
const { createHistoricoValidationRules } = require('../middlewares/validator/historicoValidator');
const { updateIndicadorCatalogos } = require('../middlewares/validator/catalogoValidator');
const router = express.Router();

/**
 * @swagger
 *   components:
 *     schemas:
 *       Indicador:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             description: Autogenerated id.
 *             example: 1
 *             readOnly: true
 *           codigo:    
 *             type: string
 *             description: Code for indicador.
 *             example: 'MA001'
 *           codigoObjeto:
 *             type: string
 *             description: SIGMUN code.
 *           nombre:
 *             type: string
 *             description: Name.
 *             example: Almacen de carbono
 *           definicion:
 *             type: string
 *             description: Detailed information about an indicador.
 *             example: El almacén de carbono es un servicio ambiental de regulación, indica la calidad y degradación del suelo. Muestra la cantidad actual de carbono almacenado en un paisaje y valora la cantidad de carbono secuestrado a lo largo del tiempo.
 *           ultimoValorDisponible:
 *             type: string
 *             description: Latest available value.
 *             example: 3.68
 *           anioUltimoValorDisponible:
 *             type: integer
 *             description: Year of latest update.
 *             example: 2020
 *           tendenciaActual:
 *             type: string
 *             description: Tendency based on historical data.
 *             example: Ascendente
 *             readOnly: true
 *           observaciones:
 *             type: string
 *             description: Observations, comments or remarks.
 *           activo:
 *             type: string
 *             description: Is indicador active?
 *             enum: [SI, NO]
 *           fuente:
 *             type: string
 *             description: Where does the information come from?
 *           periocidad:
 *             type: integer
 *             description: Number of months between updates. 
 *           createdBy:
 *             type: integer
 *             description: Identifier of the user who created this indicador.
 *             example: 1
 *           updatedBy:
 *             type: integer
 *             description: Identifier of the user who updated this indicador.
 *             example: 1
 *           idModulo:
 *             type: integer
 *             description: Modulo (topic) related to the indicador.
 *             writeOnly: true
 *             example: 1
 *       Historico:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             readOnly: true
 *             description: Autogenerated id.
 *           valor:
 *             type: string
 *             description: Historical value.
 *           anio:
 *             type: integer
 *             description: Historical year.
 *             example: 2022
 *           fuente:
 *             type: string
 *             description: Where does the information come from?
 *       UsuarioIndicador:
 *         type: object
 *         properties:
 *           id:    
 *             type: integer
 *             description: Autogenerated id.
 *             readOnly: true
 *           idUsuario:
 *             type: integer
 *             description: User id that is part of the group of users that can modify the indicator.
 *             example: 3
 *           idIndicador:
 *             type: integer
 *             description: Indicator id.
 *             example: 1
 *           fechaDesde:
 *             type: date
 *             pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
 *             description: Start date of the user's participation in the indicator.
 *             example: 2021-01-01
 *           fechaHasta:
 *             type: date
 *             pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
 *             description: End date of the user's participation in the indicator.
 *             example: 2021-01-01
 *           createdBy:
 *             type: integer
 *             description: Identifier of the user who created this relation usuario-indicador.
 *             example: 1
 *           updatedBy:
 *             type: integer
 *             description: Identifier of the user who updated this relation usuario-indicador.
 *             example: 1
 *           activo:
 *             type: string
 *             description: Is this relation active?
 *             example: 'SI'
 *           expires:
 *             type: string
 *             description: Does this relation expires?
 *             example: 'SI'
 */

/**
 * @swagger
 *   /indicadores/{idIndicador}:
 *     get:
 *       summary: Get information about an indicador.
 *       description: Retrieve indicador with given id.
 *       tags: [Indicadores]
 *       parameters:
 *         - name: idIndicador
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *       responses:
 *         200:
 *           description: Indicador object
 *           content: 
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Indicador'
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         409:
 *           $ref: '#/components/responses/Conflict'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
router.route('/:idIndicador')
  .get(
    idValidation(),
    filterIndicadoresValidationRules(),
    validate,
    determinePathway(SITE_PATH),
    exists('idIndicador', 'Indicador'),
    getIndicador
  );

/**
 * @swagger
 *   /indicadores:
 *     get:
 *       summary: Retrieve list of indicadores
 *       tags: [Indicadores]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *         - in: query
 *           name: perPage
 *           schema:
 *             type: integer
 *         - in: query
 *           name: searchQuery
 *           description: A search query to filter list of indicadores by nombre, definicion, codigo, or observaciones
 *           required: false
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: List of indicadores
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   page:
 *                     type: integer
 *                     example: 1
 *                   perPage:
 *                     type: integer
 *                     example: 25
 *                   total:
 *                     type: integer
 *                     example: 50
 *                   totalPages:
 *                     type: integer
 *                     example: 2
 *                   data:
 *                     type: array
 *                     items: 
 *                       $ref: '#/components/schemas/Indicador'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */

router.route('/')
  .get(verifyJWT,
    paginationValidationRules(),
    sortValidationRules(),
    filterIndicadoresValidationRules(),
    validate,
    determinePathway(FRONT_PATH),
    getIndicadores);


/**
 * @swagger
 *   /indicadores:
 *     post:
 *       summary: Create a new indicador
 *       tags: [Indicadores]
 *       security:
 *         - bearer: []
 *       requestBody:
 *         required: true
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Indicador'
 *       responses:
 *         201:
 *           description: Indicador created successfully
 *           content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Indicador'
 *         401: 
 *           $ref: '#/components/responses/Unauthorized'
 *         403: 
 *           $ref: '#/components/responses/Forbidden'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
router.route('/').post(
  verifyJWT,
  verifyUserIsActive,
  uploadImage(DESTINATIONS.MAPAS),
  verifyUserHasRoles(['ADMIN', 'USER']),
  createIndicadorValidationRules(),
  validate,
  createIndicador
);


/**
 * @swagger
 *   /indicadores:
 *     patch:
 *       summary: Update Indicador.
 *       description: Users can only update their indicadores (the ones assigned to them).
 *       tags: [Indicadores]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - in: path
 *           name: idIndicador
 *           schema:
 *             type: integer
 *           required: true
 *           description: Identifier of an indicador.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Indicador'
 *       responses:
 *         204:
 *           description: Updated
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
router.route('/:idIndicador')
  .patch(
    paramValidationRules(),
    uploadImage(DESTINATIONS.INDICADORES),
    updateIndicadorValidationRules(),
    validate,
    verifyJWT,
    verifyUserIsActive,
    exists('idIndicador', 'Indicador'),
    updateIndicador
  );

/**
 * @swagger
 *  /indicadores/{idIndicador}/toggle-status:
 *  patch:
 *    summary: Update status of indicador (if it was active, changes to inactive)
 *    tags: [Indicadores]
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: idIndicador
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      204:
 *        description: Updated
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      403:
 *        $ref: '#/components/responses/Forbidden'
 *      422:
 *        $ref: '#components/responses/UnprocessableEntity'
 *      429:
 *        $ref: '#components/responses/TooManyRequests'
 *      500:
 *        $ref: '#components/responses/InternalServerError'
 */
router.route('/:idIndicador/toggle-status')
  .patch(
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    paramValidationRules(),
    validate,
    exists('idIndicador', 'Indicador'),
    updateIndicadorStatus
  );


/**
 * @swagger
 *   /indicadores/{idIndicador}/usuarios:
 *   post:
 *     summary: Assign users to an indicador
 *     description: Only ADMIN users can create associations between normal users and indicadores
 *     tags: [Indicadores]
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: idIndicador
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarios:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3, 4, 5]
 *               desde:
 *                 type: string
 *                 format: date
 *               hasta:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Operation was successful (users are assigned to an indicador)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       422:
 *         $ref: '#components/responses/UnprocessableEntity'
 *       429:
 *         $ref: '#components/responses/TooManyRequests'
 *       500:
 *         $ref: '#components/responses/InternalServerError'
 */
router.route('/:idIndicador/usuarios')
  .post(
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    paramValidationRules(),
    indicadorAssignUsuarioValidationRules(),
    validate,
    createRelationUI,
  );

/**
 * @swagger
 *   /indicadores/{idIndicador}/usuarios:
 *     get:
 *       summary: Return list of users assigned to an indicador
 *       tags: [Indicadores, Usuarios]
 *     parameters:
 *       - in: path
 *         name: idIndicador
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.route('/:idIndicador/usuarios')
  .get(
    paramValidationRules(),
    validate,
    exists('idIndicador', 'Indicador'),
    getUsersFromIndicador
  )

/**
 * @swagger
 *   /indicadores/{idIndicador}/catalogos:
 *     get:
 *       summary: Retrieve the catalogos associated to an indicador.
 *       tags: [Indicadores]
 *       security: 
 *         - bearer: []
 *       parameters:
 *         - in: path
 *           name: idIndicador
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: List of catalogos.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         idIndicador:
 *                           type: integer
 *                         idCatalogoDetail:
 *                           type: integer
 *                         descripcion: 
 *                           type: string
 *                         idCatalogo:
 *                           type: integer
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         422:
 *           $ref: '#components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#components/responses/TooManyRequests'
 *         500:
 *           $ref: '#components/responses/InternalServerError'
 */
router.route('/:idIndicador/catalogos')
  .get(
    paramValidationRules(),
    validate,
    exists('idIndicador', 'Indicador'),
    getCatalogosFromIndicador
  )


/**
 * @swagger
 *   /indicadores/{idIndicador}/formula:
 *     get:
 *       summary: Retrieves formula and variables from a given Indicador
 *       tags: [Indicadores, Formulas]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - in: path
 *           name: idIndicador
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: Equation, description and variables of an Indicador.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FormulaWithVariables'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         422:
 *           $ref: '#components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#components/responses/TooManyRequests'
 *         500:
 *           $ref: '#components/responses/InternalServerError'
 */
router.route('/:idIndicador/formula')
  .get(
    paramValidationRules(),
    validate,
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['USER', 'ADMIN']),
    exists('idIndicador', 'Indicador'),
    getFormulaOfIndicador
  )

/**
 * @swagger
 *   /indicadores/{idIndicador}/formula:
 *     post:
 *       summary: Add formula to an indicador
 *       tags: [Indicadores, Formulas]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - in: path
 *           name: idIndicador
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormulaWithVariables'
 *       responses:
 *         201:
 *           description: Formula created successfully and assigned to indicador
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         422:
 *           $ref: '#components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#components/responses/TooManyRequests'
 *         500:
 *           $ref: '#components/responses/InternalServerError'
 */
router.route('/:idIndicador/formula')
  .post(
    idValidation(),
    createFormulaValidationRules(),
    validate,
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['USER', 'ADMIN']),
    exists('idIndicador', 'Indicador'),
    createFormula
  )

/**
 * @swagger
 *   /indicadores/{idIndicador}/mapa:
 *     get:
 *       summary: Get mapa of indicador
 *       tags: [Indicadores, Mapas]
 *       parameters:
 *         - in: path
 *           name: idIndicador
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: Mapa of indicador
 *         422:
 *           $ref: '#components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#components/responses/TooManyRequests'
 *         500:
 *           $ref: '#components/responses/InternalServerError'
 */
router.route('/:idIndicador/mapa')
  .get(
    idValidation(),
    validate,
    exists('idIndicador', 'Indicador'),
    getMapaOfIndicador
  );

/**
 * @swagger
 *   /indicadores/{idIndicador}/mapa:
 *     post:
 *       summary: Create a new mapa for an indicador
 *       tags: [Indicadores, Mapas]
 *       parameters:
 *         - in: path
 *           name: idIndicador
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *              schema:
 *                $ref: '#/components/schemas/Mapa'
 *       responses:
 *         201:
 *           description: Mapa created successfully and assigned to indicador
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         422:
 *           $ref: '#components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#components/responses/TooManyRequests'
 *         500:
 *           $ref: '#components/responses/InternalServerError'
 */
router.route('/:idIndicador/mapa')
  .post(
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['USER', 'ADMIN']),
    idValidation(),
    uploadImage(DESTINATIONS.MAPAS),
    mapaValidationRules(),
    validate,
    exists('idIndicador', 'Indicador'),
    createMapa
  );


/**
 * @swagger
 *   /indicadores/info/general:
 *     get:
 *       summary: Retrieve general information about Indicadores.
 *       tags: [Indicadores]
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *         - in: query
 *           name: perPage
 *           schema:
 *             type: integer
 *         - in: query
 *           name: id
 *           schema:
 *             type: integer
 *         - in: query
 *           name: sortBy
 *           schema:
 *             type: string
 *         - in: query
 *           name: order
 *           schema:
 *             type: string
 *             enum: [asc, desc]
 *         - in: query
 *           name: attributes
 *           schema:
 *             type: array
 *       security:
 *         - bearer: []
 *       responses:
 *         200:
 *           description: General information about Indicadores.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Indicador'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         422:
 *           $ref: '#components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#components/responses/TooManyRequests'
 *         500:
 *           $ref: '#components/responses/InternalServerError'
 */
router.route('/info/general')
  .get
  (
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['USER', 'ADMIN']),
    determineModel,
    generalFilterOptions(),
    paramValidationRules(),
    paginationValidationRules(),
    generalSortValidationRules(),
    validate,
    getInformation,
  )

/**
 * @swagger
 *   /indicadores/{idIndicador}/historicos:
 *     get:
 *       summary: Fetch historicos
 *       description: Get a list of historicos from an indicador
 *       tags: [Historicos, Indicadores]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - name: idIndicador
 *           in: path
 *           required: true
 *           description: The id of the indicador
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *       responses:
 *         200:
 *           description: List of historicos from an indicador
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Historico'
 *         400:
 *           $ref: '#/components/responses/BadRequest'
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
router.route('/:idIndicador/historicos')
  .get(
    verifyJWT,
    verifyUserIsActive,
    paginationValidationRules(),
    sortValidationRules(),
    idValidation(),
    validate,
    getHistoricos
  );


/**
 * @swagger
 *   /indicadores/{idIndicador}/historicos:
 *     post:
 *       summary: Add historical data to an Indicador
 *       tags: [Historicos, Indicadores]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - name: idIndicador
 *           in: path
 *           required: true
 *           description: The id of the indicador
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *       responses:
 *         201:
 *           description: Historical data created successfully
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
router.route('/:idIndicador/historicos')
  .post(
    verifyJWT,
    verifyUserIsActive,
    createHistoricoValidationRules(),
    validate,
    createHistorico
  );


/**
 * @swagger
 *   /indicadores/{idIndicador/catalogos}:
 *     patch:
 *       summary: Update or create catalogo for an indicador
 *       tags: [Indicadores, Catalogos]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - name: idIndicador
 *           in: path
 *           required: true
 *           description: The id of the indicador
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *       responses:
 *         204:
 *           description: Operation (whether is update or create catalogo) was successful
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
router.route('/:idIndicador/catalogo')
  .patch(
    verifyJWT,
    verifyUserIsActive,
    idValidation(),
    updateIndicadorCatalogos(),
    validate,
    updateOrCreateCatalogFromIndicador,
  )

module.exports = router;