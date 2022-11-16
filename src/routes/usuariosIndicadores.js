const express = require('express');
const router = express.Router();

const {
    paramValidationRules,
    validate,
    paginationValidationRules,
} = require('../middlewares/validator/generalValidator')

const {
    sortValidationRules, relationTypeValidationRules, relationAssignValidationRules
} = require('../middlewares/validator/usuarioIndicadorValidator')

const { verifyJWT, verifyUserIsActive, verifyUserHasRoles } = require('../middlewares/auth');
const {
    getIndicadoresRelations,
    createRelationUI,
    getRelationUsers,
    getUsuarios,
    deleteRelation,
    updateRelation,
} = require('../controllers/usuarioIndicadorController');


/**
 * @swagger
 *   /relation:
 *     get:
 *       summary: Get a list of relations between users and indicators and the owner (responsable) of the indicator.
 *       tags: [UsuarioIndicador]
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
 *           description: A search query to filter list of indicadores by nombre
 *           required: false
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: List of relations between usuarios - indicadores
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
 *                       $ref: '#/components/schemas/UsuarioIndicador'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */

router.get(
    '/',
    paginationValidationRules(),
    sortValidationRules(),
    paramValidationRules(),
    validate,
    getIndicadoresRelations,
);

/**
 * @swagger
 *   /relation/create:
 *     post:
 *       summary: Creates a relation between a user and multiple indicators or viceversa, depending on the relationType.
 *       tags: [UsuarioIndicador]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - in: query
 *           name: relationType
 *           description: The type of relation to create. Can be 'usuarios' or 'indicadores'
 *           required: true
 *           schema:
 *             type: string
 *         - in: query
 *           name: id
 *           description: The id of the user or indicator to assign the relation to.
 *           required: false
 *           schema:
 *             type: int
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 relationIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1,2, 3, 4]
 *                 desde:
 *                   type: string
 *                   format: date
 *                   example: 2020-01-01
 *                 hasta:
 *                   type: string
 *                   format: date
 *                   example: 2020-01-01
 *                 expires:
 *                   type: string
 *                   example: SI
 *       responses:
 *         201:
 *           description: Operation was successful
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */

router.post('/create',
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    relationAssignValidationRules(),
    relationTypeValidationRules(),
    validate,
    createRelationUI,
);

/**
 * @swagger
 *   /relation/indicador/{idIndicador}:
 *     get:
 *       summary: Get a list of users assigned to an indicator.
 *       description: Get a list of users assigned to an indicator.
 *       tags: [UsuarioIndicador]
 *       security:
 *         - bearer: []
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
 *           description: UsuarioIndicador object
 *           content: 
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Indicador'
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */

router.get(
    '/indicador/:idIndicador',
    paramValidationRules(),
    validate,
    getRelationUsers,
);

/**
 * @swagger
 *   /relation/indicador/{idIndicador}/usuarios:
 *     get:
 *       summary: Get a list of users not assigned to an indicator.
 *       description: Get a list of users that are not assigned to an indicator.
 *       tags: [UsuarioIndicador]
 *       security:
 *         - bearer: []
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
 *           description: UsuarioIndicador object
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Usuario'
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 * 
 */

router.get(
    '/indicador/:idIndicador/usuarios',
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    paramValidationRules(),
    validate,
    getUsuarios,
);

/**
 * @swagger
 *   /relation/{idRelacion}:
 *     delete:
 *       summary: Deletes a relation between an user and an indicador.
 *       description: Deletes a relation between an user and an indicador.
 *       tags: [UsuarioIndicador]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - name: idRelacion
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *       responses:
 *         204:
 *           description: Operation was successful
 *         404:
 *           $ref: '#/components/responses/NotFound'
 *         422:
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 * 
 */

router.delete(
    '/:idRelacion',
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    paramValidationRules(),
    validate,
    deleteRelation,
);

router.patch(
    '/:idRelacion',
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    paramValidationRules(),
    validate,
    updateRelation,
);

module.exports = router;