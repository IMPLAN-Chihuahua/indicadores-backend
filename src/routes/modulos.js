const express = require('express');
const moduloRouter = express.Router();
const indicadorRouter = express.Router({ mergeParams: true });
const { getModulos, createModulo, editModulo, updateModuloStatus } = require('../controllers/moduloController');
const { getIndicadores, getIndicador } = require('../controllers/indicadorController');
const { paramValidationRules, paginationValidationRules,
    validate, filterIndicadoresValidationRules, sortValidationRules, createModuloValidationRules, updateModuloValidationRules } = require('../middlewares/validator');
const { moduloExists } = require('../middlewares/verifyIdModulo');
const { verifyJWT } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/fileUpload');
const { determinePathway } = require('../middlewares/determinePathway');

/**
 * @swagger
 *   components:
 *     schemas:
 *       Modulo:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             description: Identifier of a module
 *             example: 1
 *             readOnly: true
 *           temaIndicador:
 *             type: string
 *             description: Indicador title
 *             example: Indicador de accesibilidad ciclista
 *           codigo:
 *             type: string
 *             description: Code of a module
 *             example: '666'
 *           observaciones:
 *             type: string
 *             description: Commentaries of a module
 *             example: Modulo de accesibilidad ciclista, definido por la norma ISO/IEC 9126-1:2015
 *           activo:
 *             type: string
 *             description: Active state of a module
 *             example: 'SI'
 *           urlImagen:
 *             type: string
 *             description: URL to the image of a module
 *             example: http://example.com/image.png
 *           color:
 *             type: string
 *             description: Color of a module
 *             example: 'green'
 *           createdAt:
 *             type: string 
 *             description: Date of creation of a module
 *             example: 2020-01-01T00:00:00.000Z
 *             readOnly: true
 */
moduloRouter.use('/:idModulo/indicadores', indicadorRouter);


/**
 * @swagger
 *   /modulos:
 *     get:
 *       summary: Retrieves a list of modules
 *       description: Retrieves a list of modules from the database
 *       tags: [Modulos]
 *       responses:
 *         200:
 *           description: A very friendly list of modules
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items: 
 *                       $ref: '#/components/schemas/Modulo'
 *                     description: List of modules
 *         500:
 *           description: Internal server error
 */
moduloRouter.route('/')
    .get(getModulos);


/**
 * @swagger
 *   /modulos/{idModulo}/indicadores:
 *     get:
 *       summary: Retrieves a list of indicadores after validation
 *       description: Retrieves a list of indicadores from the database after pagination validation
 *       tags: [Modulos]
 *       parameters:
 *         - name: idModulo
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *             description: Identifier of a module
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *             description: Page number
 *         - name: perPage
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *             description: Number of elements per page
 *         - name: idOds
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             description: Identifier of an ODS
 *         - name: idCobertura
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             description: Identifier of an coverage
*         - name: idUnidadMedida
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             description: Identifier of an unit of measure
 *         - name: anioUltimoValorDisponible
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             format: int64
 *             description: Identifier of an year
 *         - name: tendenciaActual
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             format: string
 *             description: Identifier of an trend
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
 * 
 */

indicadorRouter.route('/')
    .get(
        paramValidationRules(),
        paginationValidationRules(),
        filterIndicadoresValidationRules(),
        sortValidationRules(),
        validate,
        moduloExists,
        determinePathway('site'),
        getIndicadores
    );

/** Administrative section */

/**
 * @swagger
 * /modulos:
 *   post:
 *     summary: Creates a new module
 *     tags: [Modulos]
 *     security:
 *       - bearer: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               temaIndicador:
 *                 type: string
 *               codigo:
 *                 type: string
 *               activo:
 *                 type: string
 *               color:
 *                 type: string
 *               observaciones:
 *                 type: string
 *               urlImagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Module created successfully
 *       400:
 *         description: Unable to create new modulo (temaIndicador is already on use)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

moduloRouter.route('/')
    .post(
        verifyJWT,
        uploadImage('modulos'),
        createModuloValidationRules(),
        validate,
        createModulo
    );
/** 
 * @swagger
 *   /modulos/{idModulo}:
 *     put:
 *      summary: Updates a module with given parameters
 *      tags: [Modulos]
 *      parameters:
 *        - name: idModulo
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *            format: int64
 *            minimum: 1
 *            description: Identifier of a module
 *      security:
 *        - bearer: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Modulo'
 *      responses:
 *        204:
 *          description: Module updated successfully
 *        404:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 * 
 */

moduloRouter.route('/:idModulo')
    .put(
        verifyJWT,
        updateModuloValidationRules(),
        validate,
        editModulo
    );

/**
 * @swagger
 *   /modulos/{idModulo}:
 *     patch:
 *       summary: Updates a modulo status (active/inactive)
 *       tags: [Modulos]
 *       parameters:
 *         - name: idModulo
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *             description: Identifier of a module
 *       security:
 *         - bearer: []
 *       responses:
 *         204:
 *           description: Module status updated successfully
 *         404:
 *           description: Bad request
 *         500:
 *           description: Internal server error
 */

moduloRouter.route('/:idModulo')
    .patch(
        verifyJWT,
        updateModuloValidationRules(),
        validate,
        updateModuloStatus
    );

module.exports = moduloRouter;