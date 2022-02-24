const express = require('express');
const router = express.Router();
const { paramValidationRules,
    validate,
    createIndicadorValidationRules } = require('../middlewares/validator');
const { getIndicador, getAllIndicadores, createIndicador } = require('../controllers/indicadorController');
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
 *         500:
 *           description: Internal server error
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
 *         500:
 *           description: Internal server error
 */

router.route('/')
    .get(verifyJWT, getAllIndicadores);


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
 *         500:
 *           description: Internal server error
 */
router.route('/')
    .post(
        createIndicadorValidationRules(),
        validate,
        verifyJWT,
        verifyRoles(['ADMIN']),
        createIndicador
    );

module.exports = router;