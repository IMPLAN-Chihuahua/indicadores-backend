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
    getIndicadores,
    createIndicador,
    updateIndicador } = require('../controllers/indicadorController');
const { verifyJWT, verifyRoles } = require('../middlewares/auth');
const { determinePathway } = require('../middlewares/pathway');

/**
 * @swagger
 *   components:
 *     schemas:
 *       Indicador:
 *         type: object
 *         properties:
 *           id:
 *             type: intger
 *             description: Identifier of an indicador
 *             example: 1
 *             readOnly: true
 *           urlImagen:   
 *             type: string 
 *             description: Base url to display a map
 *             example: http://example.com/map
 *           codigo:    
 *             type: string
 *             description: Code for Indicator
 *             example: '001'
 *           codigoObjeto:
 *             type: string
 *             description: SIGMUN code
 *             example: '001'
 *           nombre:
 *             type: string
 *             description: Name of the Indicator
 *             example: Almacen de Carbono
 *           definicion:
 *             type: string
 *             description: Detailed information of an Indicador
 *             example: Lorem ipsum at dolor
 *           ultimoValorDisponible:
 *             type: string
 *             description: Last value available for the Indicator
 *           anioUltimoValorDisponible:
 *             type: integer
 *             description: Year of the late information of an Indicador
 *             example: 2022
 *           tendenciaActual:
 *             type: string
 *             description: Tendency based on historical data
 *             example: Ascendente
 *             readOnly: true
 *           tendenciaDeseada:  
 *             type: string
 *             description: Desired tendency
 *             example: Ascendente
 *           observaciones:
 *             type: string
 *             description: Notes about an Indicador
 *           createdBy:
 *             type: integer
 *             description: Identifier of the user who created an Indicador
 *             example: 1
 *           updatedBy:
 *             type: integer
 *             description: Identifier of the user who updated an Indicador
 *             example: 1
 *           mapa:
 *             type: object
 *             $ref: '#/components/schemas/Mapa'
 *           formula:
 *             type: object
 *             $ref: '#/components/schemas/Formula'
 *           historicos:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Historico'
 *           idModulo:
 *             type: integer
 *             description: Module in which the indicador is part of
 *             example: 1
 *           idOds:
 *             type: integer
 *             description: Identifier of the ODS (Objectivo de Desarrollo Sostenible)
 *             example: 1
 *           idCobertura:
 *             type: integer
 *             description: Identifier of the coverage
 *             example: 1
 *           idUnidadMedida:
 *             type: integer
 *             description: Identifier of the unit of measure
 *             example: 1
 *       Formula:
 *         type: object
 *         properties:
 *           ecuacion:
 *             type: string
 *             description: TODO
 *           descripcion:
 *             type: string
 *             description: TODO
 *           variables:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Variable'
 *       Variable:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             readOnly: true
 *           nombre:
 *             type: string
 *             description: TODO
 *           codigoAtributo:
 *             type: string
 *             description: TODO
 *           nombreAtributo:
 *             type: string 
 *             description: TODO
 *           dato:
 *             type: string
 *             description: TODO
 *           idUnidad:
 *             type: integer
 *             description: TODO
 *           anio:
 *             type: integer
 *             description: TODO
 *             example: 2022
 *       Historico:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             readOnly: true
 *           valor:
 *             type: string
 *           anio:
 *             type: integer
 *             example: 2022
 *           fuente:
 *             type: string     
 *       Fuente:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             readOnly: true
 *           bibliografia:
 *             type: string  
 *       Mapa:
 *         type: object
 *         properties:
 *           id:    
 *             type: integer
 *             description: TODO
 *             readOnly: true
 *           ubicacion:
 *             type: string
 *             description: TODO 
 *           url:
 *             type: string
 *             description: TODO
 *             example: 'http://example.com/map'
 */

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
        determinePathway('site'),
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
    .get(verifyJWT,
        paginationValidationRules(),
        sortValidationRules(),
        filterIndicadoresValidationRules(),
        validate,
        determinePathway('front'),
        getIndicadores);


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