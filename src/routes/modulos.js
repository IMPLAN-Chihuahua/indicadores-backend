const express = require('express');
const moduloRouter = express.Router();
const indicadorRouter = express.Router({ mergeParams: true });
const { getModulos } = require('../controllers/moduloController');
const { getIndicadores, getIndicador } = require('../controllers/indicadorController');
const { paramValidationRules, paginationValidationRules,
    validate, filterIndicadoresValidationRules, sortValidationRules } = require('../middlewares/validator');
const { moduloExists } = require('../middlewares/verifyIdModulo');

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
 *             example: 001 
 *           observaciones:
 *             type: string
 *             description: Commentaries of a module
 *             example: Modulo de accesibilidad ciclista, definido por la norma ISO/IEC 9126-1:2015
 *           createdAt:
 *             type: string 
 *             description: Date of creation of a module
 *             example: 2020-01-01T00:00:00.000Z
 *             readOnly: true
 *       Indicador:
 *         type: object
 *         properties:
 *           id:
 *             type: intger
 *             description: Identifier of an indicador
 *             example: 1
 *             readOnly: true
 *           url:   
 *             type: string 
 *             description: Base url to display a map
 *             example: http://example.com/map
 *           codigo:    
 *             type: string
 *             description: Code for Indicator
 *             example: '001'
 *           nombre:
 *             type: string
 *             description: Name of the Indicator
 *             example: Almacen de Carbono
 *           definicion:
 *             type: string
 *             description: Detailed information of an Indicador
 *             example: Lorem ipsum at dolor
 *           anioUltimoValorDisponible:
 *             type: string
 *             description: Year of the late information of an Indicador
 *             example: 2019
 *           tendenciaActual:
 *             type: string
 *             description: TODO
 *             example: Ascendente
 *             readOnly: true
 *           tendenciaDeseada:  
 *             type: string
 *             description: TODO
 *             example: Ascendente
 *           mapa:
 *             type: integer
 *             description: Reference to a map
 *             example: 1
 *           grafica:
 *             type: integer
 *             description: Does the Indicador have a chart?
 *             example: 1
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
 *       tags: [Indicadores]
 *       parameters:
 *         - name: idModulo
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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
        getIndicadores
    );

/**
 * @swagger
 *   /modulos/{idModulo}/indicadores/{idIndicador}:
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
 *         - name: idModulo
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
 *         500:
 */
indicadorRouter.route('/:idIndicador')
    .get(paramValidationRules(),
        validate,
        moduloExists,
        getIndicador);

module.exports = moduloRouter;