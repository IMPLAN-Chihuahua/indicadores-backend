const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../controllers/usuarioController');
const { verifyJWT } = require('../middlewares/auth');
const { getIndicadoresFromUser } = require('../controllers/indicadorController');

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
 *          description: Unauthorized request (not valid JWT in Authorization header)
 *        403:
 *          description: The request has an invalid or expired token
 *        422:
 *          description: Unable to process request due to semantic errors in the body or param payload
 */

router.route('/').get(verifyJWT, getUserFromToken);

/**
 * @swagger
 *   /me/indicadores:
 *     get:
 *       summary: Retrieves a list of indicadores after validation
 *       description: Retrieves a list of indicadores from the database after pagination validation
 *       tags: [Perfiles]
 *       security:
 *         - bearer: []
 *       responses:
 *         200:
 *           description: A very friendly list of indicadores
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
 */

router.route('/indicadores').get(verifyJWT, getIndicadoresFromUser);

module.exports = router;