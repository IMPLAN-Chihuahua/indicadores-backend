const express = require('express');

const router = express.Router();
const {
    getUserFromToken,
    getUserFromId,
    editUser } = require('../controllers/usuarioController');
const { verifyJWT, verifyUserIsActive } = require('../middlewares/auth');

const {
    getIndicadoresFromUser,
    getIndicador } = require('../controllers/indicadorController');
const { getAllModulos } = require('../controllers/moduloController');

const {
    validate,
    paramValidationRules,
    paginationValidationRules,
    filterModulosValidationRules,
    sortModulosValidationRules,
    updateValidationRules } = require('../middlewares/validator');

const { determinePathway, FRONT_PATH } = require('../middlewares/determinePathway');

const { uploadImage } = require('../middlewares/fileUpload');
/**
 * @swagger
 *  /me:
 *    get:
 *      summary: Get a user with a given id
 *      tags: [Perfiles]
 *      security:
 *        - bearer: []
 *      responses: 
 *        200:
 *          description: Information of a user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Usuario'
 *        204:
 *          description: Not user was found with the given id
 *        401:
 *          $ref: '#/components/responses/Unauthorized'
 *        403:
 *          $ref: '#/components/responses/Forbidden'
 *        429:
 *          $ref: '#/components/responses/TooManyRequests'
 *        500:
 *          $ref: '#/components/responses/InternalServerError'
 */

router.route('/').get(
    verifyJWT,
    verifyUserIsActive,
    getUserFromToken
);

/**
 * @swagger
 *   /me/indicadores:
 *     get:
 *       summary: Retrieves a list of indicadores after validation
 *       description: Retrieves a list of indicadores from the database after pagination validation
 *       tags: [Perfiles]
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
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */

router.route('/indicadores').get(
    verifyJWT,
    verifyUserIsActive,
    getIndicadoresFromUser
);


router.route('/indicadores/:idIndicador').get(
    verifyJWT,
    verifyUserIsActive,
    paramValidationRules(),
    validate,
    determinePathway(FRONT_PATH),
    getIndicador,
);

/**
 * @swagger
 *   /me/modulos:
 *     get:
 *       summary: List of modulos.
 *       description: Retrieves a list of modulos from the database after pagination, sorting and filtering validation
 *       tags: [Perfiles]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - name: page
 *           in: query
 *           description: Page number
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *             description: Page number
 *         - name: perPage
 *           in: query
 *           description: Number of items per page
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *             description: Number of items per page
 *         - name: sortBy
 *           in: query
 *           description: Sort by field
 *           required: false
 *           schema:
 *             type: string
 *             description: Sort by field
 *         - name: order
 *           in: query
 *           description: Order of the sort
 *           required: false
 *           schema:
 *             type: string
 *             description: Order of the sort
 *             enum: [asc, desc]
 *         - name: searchQuery
 *           in: query
 *           description: Search query
 *           required: false
 *           schema:
 *             type: string
 *             description: Search query
 *       responses:
 *         200:
 *           description: List of modulos.
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
 *                       $ref: '#/components/schemas/Modulo'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 */

router.route('/modulos').get(
    verifyJWT,
    verifyUserIsActive,
    paginationValidationRules(),
    filterModulosValidationRules(),
    sortModulosValidationRules(),
    validate,
    getAllModulos,
);


/**
 * @swagger
 *   /me:
 *     patch:
 *       summary: Update user.
 *       tags: [Perfiles]
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.patch(
    '/',
    uploadImage('usuarios'),
    updateValidationRules(),
    validate,
    verifyJWT,
    editUser,
)

module.exports = router;