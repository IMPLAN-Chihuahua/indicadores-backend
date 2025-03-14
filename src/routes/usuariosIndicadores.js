const promisedRouter = require('express-promise-router');
const router = promisedRouter();

const {
    paramValidationRules,
    validate,
    paginationValidationRules,
    idValidation,
} = require('../middlewares/validator/generalValidator')

const {
    sortValidationRules,
    relationAssignValidationRules,
    filterRelationValidationRules,
    userRelationAssignationValidationRules,
    changeOwnerValidationRules,
    assignationValidationRules,
} = require('../middlewares/validator/usuarioIndicadorValidator')

const { verifyJWT, verifyUserIsActive, verifyUserHasRoles } = require('../middlewares/auth');
const {
    getIndicadoresRelations,
    createRelationUI,
    getRelationUsers,
    getUsuarios,
    deleteRelation,
    updateRelation,
    changeOwner,
    createRelation
} = require('../controllers/usuarioIndicadorController');
const { verifyUserIsOwnerOfIndicador } = require('../middlewares/verifyUserCanPerformAction');

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

router.post('/create/:idIndicador',
    idValidation(),
    relationAssignValidationRules(),
    validate,
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN', 'USER']),
    verifyUserIsOwnerOfIndicador({ routeParam: 'idIndicador' }),
    createRelationUI,
);

router.post('/create',
    assignationValidationRules(),
    validate,
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    createRelation,
)

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
    paginationValidationRules(),
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
    verifyUserHasRoles(['ADMIN', 'USER']),
    paramValidationRules(),
    validate,
    getUsuarios,
);


router.patch('/owner/:idIndicador',
    changeOwnerValidationRules(),
    paramValidationRules(),
    validate,
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    changeOwner,
)

router.patch(
    '/:idRelacion',
    relationAssignValidationRules(),
    paramValidationRules(),
    validate,
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    updateRelation,
);

module.exports = router;