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
    getRelationUsers
} = require('../controllers/usuarioIndicadorController');


/**
 * @swagger
 *   /relation:
 *     get:
 *       summary: Get a list of relations between users and indicators and the owner (responsable) of the indicator.
 *       tags: [UsuarioIndicador]
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

router.post('/create',
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    relationAssignValidationRules(),
    relationTypeValidationRules(),
    validate,
    createRelationUI,
);

router.get(
    '/indicador/:idIndicador',
    paramValidationRules(),
    validate,
    getRelationUsers,
)

module.exports = router;