const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../controllers/usuarioController');
const { verifyJWT } = require('../middlewares/auth');
const { getIndicadoresFromUser } = require('../controllers/indicadorController');
const { getAllModulos } = require('../controllers/moduloController');
const { paramValidationRules, paginationValidationRules,
    validate, filterModulosValidationRules, sortModulosValidationRules } = require('../middlewares/validator');
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

/* TODO: Implementar VerifyRole */

router.route('/indicadores').get(verifyJWT, getIndicadoresFromUser);

/**
 * @swagger
 *   /me/modulos:
 *     get:
 *       summary: Retrieves a list of modulos after pagination, sorting and filtering validation
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
 *           description: A very friendly list of modulos
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Modulo'
 *         403:
 *           description: The request has an invalid or expired token
 *         404:
 *           description: Indicador or Modulo was not found
 *         422:
 *           description: Unable to process request due to semantic errors
 *         500:
 *           description: Internal server error
 */

router.route('/modulos')
    .get(
        paginationValidationRules(), 
        filterModulosValidationRules(),
        sortModulosValidationRules(),
        validate, 
        verifyJWT,
        getAllModulos,
        );

module.exports = router;