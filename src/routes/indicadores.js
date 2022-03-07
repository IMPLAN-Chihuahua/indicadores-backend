const express = require('express');
const router = express.Router();
const { paramValidationRules,
    validate,
    createIndicadorValidationRules, 
    updateIndicadorValidationRules,
    paginationValidationRules,
    filterIndicadoresValidationRules,
    sortValidationRules
} = require('../middlewares/validator');
const {
    getIndicador,
    getAllIndicadores,
    createIndicador,
    updateIndicador } = require('../controllers/indicadorController');
const { verifyJWT, verifyRoles } = require('../middlewares/auth');

/**
 * @swagger
 *   /indicadores/{idIndicador}:
 *     get:
 *       summary: Indicador object
 *       description: Retrieve data of an Indicador
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
 *           description: Indicador or Modulo was not found
 *         422:
 *           description: Unable to process request due to semantic errors
 * 
 */
router.route('/:idIndicador')
    .get(paramValidationRules(),
        validate,
        getIndicador);

/**
 * @swagger
 *   /indicadores:
 *     get:
 *       summary: Retrieves a list of indicadores
 *       tags: [Indicadores]
 *       security:
 *         - bearer: []
 *       responses:
 *         200:
 *           description: A very friendly list of indicadores
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Indicador'
 *         401:
 *           description: Unauthorized request (not valid JWT in Authorization header)
 */

router.route('/')
    .get(verifyJWT, paginationValidationRules(), sortValidationRules(), filterIndicadoresValidationRules(), validate, getAllIndicadores);


/**
 * @swagger
 *   /indicadores:
 *     post:
 *       summary: Creates a new indicador
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
 *           description: Request does not have token in Authorization header
 *         403: 
 *           description: Invalid token or not permission 
 *         422:
 *           description: The value of some fields are invalid
 */
router.route('/')
    .post(
        createIndicadorValidationRules(),
        validate,
        verifyJWT,
        verifyRoles(['ADMIN']),
        createIndicador
    );

/**
 * @swagger
 *   /indicadores:
 *     patch:
 *       summary: Update information about an Indicador
 *       tags: [Indicadores]
 *       security:
 *         - bearer: []
 *       parameters:
 *         - in: path
 *           name: idIndicador
 *           schema:
 *             type: integer
 *           required: true
 *           description: Identifier of an indicador
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
 *           description: Unauthorized
 *         403:
 *           description: Forbidden
 *         422:
 *           description: Unable to process request due to semantic errors
 */
router.route('/:idIndicador')
    .patch(
        paramValidationRules(),
        updateIndicadorValidationRules(),
        validate,
        verifyJWT,
        updateIndicador
    );

module.exports = router;