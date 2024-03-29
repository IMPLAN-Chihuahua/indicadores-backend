const express = require('express');
const { query } = require('express-validator');

const router = express.Router();
const { getUsers,
  createUser,
  getUserFromId,
  editUser,
  editUserStatus, 
  getUserStats} = require('../controllers/usuarioController');
const { verifyJWT, verifyUserHasRoles, verifyUserIsActive } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/fileUpload');

const {
  registerValidationRules,
  updateValidationRules
} = require('../middlewares/validator/usuarioValidator')

const {
  paginationValidationRules,
  paramValidationRules,
  validate,
  generalFilterOptions,
  generalSortValidationRules,
  idValidation
} = require('../middlewares/validator/generalValidator')
const { exists } = require('../middlewares/resourceExists');
const { DESTINATIONS } = require('../services/fileService');
const { determineModel } = require('../middlewares/determinePathway');
const { getInformation } = require('../controllers/generalController');

/**
 * @swagger
 *   components:
 *     schemas:
 *       Usuario:
 *         type: object
 *         required:
 *           - correo
 *           - clave
 *           - nombres
 *           - apellidoPaterno
 *         properties:
 *           id:
 *             type: integer
 *             example: 1
 *             description: Autogenerated id
 *             readOnly: true
 *           correo:
 *             type: string
 *             example: johndoe@email.com
 *             description: Email address
 *           clave:
 *             type: string
 *             format: password
 *             description: Password
 *             writeOnly: true
 *           nombres:
 *             type: string
 *             example: John
 *             description: First name
 *           apellidoPaterno:
 *             type: string
 *             example: Doe
 *             description: First lastname
 *           apellidoMaterno:
 *             type: string
 *             description: Second lastname
 *           urlImagen:
 *             type: string
 *             format: binary
 *             description: Profile picture
 *           activo:
 *             $ref: '#/components/schemas/Status'
 *           idRol:
 *             type: int
 *             example: 1
 *             description: Id of given rol
 *           createAt:
 *             type: string
 *             format: date-time
 *             description: Timestamp of creation in 'Z time'
 *             readOnly: true
 *           updatedAt:
 *             type: string
 *             format: date-time
 *             description: Timestamp of latest update in 'Z time'
 *             readOnly: true
 *       Status:
 *         type: string
 *         enum: [SI, NO]
 */

/**
 * @swagger
 *   /usuarios:
 *     get:
 *       summary: List of users
 *       description: Retrieve a list of users
 *       tags: [Usuarios]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           example: 1
 *         - in: query
 *           name: perPage
 *           schema:
 *             type: integer
 *           example: 25
 *         - in: query
 *           name: searchQuery
 *           description: A search query to filter list of users by nombres, apellido paterno, apellido materno, or correo
 *           required: false
 *           schema:
 *             type: string
 *       responses: 
 *         200:
 *           description: A list of users
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
 *                       $ref: '#/components/schemas/Usuario'
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
router.get(
  '/',
  verifyJWT,
  verifyUserIsActive,
  verifyUserHasRoles(['ADMIN', 'USER']),
  paginationValidationRules(),
  query('searchQuery'),
  validate,
  getUsers
);

/**
 * @swagger
 *   /usuarios:
 *     post:
 *       summary: Create user
 *       description: A user with ADMIN rol can register new users
 *       tags: [Usuarios]
 *       security:
 *         - bearer: []
 *       requestBody: 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       responses: 
 *         201:
 *           description: Created user
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: object
 *                     $ref: '#/components/schemas/Usuario'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         403:
 *           $ref: '#/components/responses/Forbidden'
 *         409:
 *           description: Conflict
 *           content:
 *             application/json:
 *               type: object
 *               schema:
 *                   $ref: '#/components/schemas/BasicError'
 *               example:
 *                 status: 409
 *                 message: Email address is already in use 
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/',
  verifyJWT,
  verifyUserIsActive,
  verifyUserHasRoles(['ADMIN']),
  uploadImage(DESTINATIONS.USUARIOS),
  registerValidationRules(),
  validate,
  createUser
);


/**
 * @swagger
 *  /usuarios/{idUser}:
 *    get:
 *      summary: Get information about a user
 *      description: Retrieve user with given id
 *      tags: [Usuarios]
 *      parameters:
 *        - in: path
 *          name: idUser
 *          format: int64
 *          required: true
 *          schema: 
 *            type: integer
 *          style: simple
 *      responses:
 *        200:
 *          description: A user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: object
 *                    $ref: '#/components/schemas/Usuario'
 *        404:
 *          $ref: '#/components/responses/NotFound'
 *        422:
 *          $ref: '#/components/responses/UnprocessableEntity'
 *        500:
 *          $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/:idUser',
  paramValidationRules(),
  validate,
  exists('idUser', 'Usuario'),
  getUserFromId
);


/**
 * @swagger
 *  /usuarios/{idUser}:
 *    patch:
 *      summary: Update user's information
 *      tags: [Usuarios]
 *      security:
 *        - bearer: []
 *      parameters:
 *        - in: path
 *          name: idUser
 *          format: int64
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody: 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Usuario'
 *      responses:
 *        204:
 *          description: Updated
 *        401:
 *          $ref: '#/components/responses/Unauthorized'
 *        403:
 *          $ref: '#/components/responses/Forbidden'
 *        422:
 *          $ref: '#/components/responses/UnprocessableEntity'
 *        429:
 *          $ref: '#/components/responses/TooManyRequests'
 *        500:
 *          $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  '/:idUser',
  verifyJWT,
  verifyUserIsActive,
  verifyUserHasRoles(['ADMIN']),
  uploadImage(DESTINATIONS.USUARIOS),
  paramValidationRules(),
  updateValidationRules(),
  validate,
  editUser
);


/**
 * @swagger
 *  /usuarios/{idUser}/toggle-status:
 *  post:
 *    summary: Toggles the status of a user.
 *    description: Update user status, if it is active it will change to inactive.
 *    tags: [Usuarios]
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: idUser
 *        required: true
 *        format: int64
 *        schema:
 *          type: integer
 *    responses:
 *      204:
 *        description: Updated
 *      400:
 *        description: User status was not changed.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BasicError'
 *            example:
 *              status: 400
 *              message: Could not update user status
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      403:
 *        $ref: '#/components/responses/Forbidden'
 *      422:
 *        $ref: '#/components/responses/UnprocessableEntity'
 *      429:
 *        $ref: '#/components/responses/TooManyRequests'
 *      500:
 *        $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/:idUser/toggle-status',
  verifyJWT,
  verifyUserIsActive,
  verifyUserHasRoles(['ADMIN']),
  paramValidationRules(),
  validate,
  editUserStatus,
);

/**
 * @swagger
 *   /usuarios/info/general:
 *     get:
 *       summary: Retrieve general information about Usuarios.
 *       tags: [Usuarios]
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
 *           description: General information about Usuarios.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Usuario'
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
router.get
  (
    '/info/general',
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
 *   /usuarios/{idUsuario}/stats:
 *     get:
 *       summary: Retrieve stats about a user
 *       tags: [Usuarios]
 *       security:
 *         - bearer: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         format: int64
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stats about a user (assigned indicadores, inactive temas, etc.)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/:idUser/stats',
  verifyJWT,
  verifyUserIsActive,
  idValidation(),
  validate,
  exists('idUser', 'Usuario'),
  getUserStats,
)

module.exports = router;