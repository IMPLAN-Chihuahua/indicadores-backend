const express = require('express');
const router = express.Router();
const { paramValidationRules,
    validate } = require('../middlewares/validator');
const { getIndicador, getAllIndicadores } = require('../controllers/indicadorController');
const { verifyJWT } = require('../middlewares/auth');

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
router.route('/:idIndicador/')
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

module.exports = router;