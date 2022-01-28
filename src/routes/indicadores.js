const express = require('express');
const indicadorRouter = express.Router({ mergeParams: true });
const { paramValidationRules,
    validate } = require('../middlewares/validator');

const { getIndicador } = require('../controllers/indicadorController');

// /**
//  * @swagger
//  *   components:
//  *     schemas:
//  *       Indicadors:
//  *         type: object
//  *         properties:
//  *           id: 
//  *             description: Identifier of an Indicator
//  *             type: integer
//  *             example: 1
//  *             readOnly: true
//  *           urlImagen:
//  *             description: URL to the image of an indicador
//  *             type: string
//  *             example: http://example.com/image.png
//  *             readOnly: true
//  *           nombre:
//  *             description: Indicador's name
//  *             type: string
//  *             example: Almacen de Carbono
//  *             readOnly: true
//  *           ultimoValorDisponible:
//  *             description: Last value available for the indicador
//  *             type: string
//  *             example: 2542
//  *             readOnly: true
//  *           anioUltimoValorDisponible:
//  *             description: Last year registered for the last value available for the indicador
//  *             type: integer
//  *             example: 2022
//  *             readOnly: true
//  *           tendenciaActual:
//  *             description: Actual tendecy of the indicador
//  *             type: string
//  *             example: ASCENDENTE
//  *             readOnly: true
//  *           tendenciaDeseada:
//  *             description: Desirable tendecy of the indicador
//  *             type: string
//  *             example: DESCENDENTE
//  *             readOnly: true
//  *           mapa:
//  *             description: Value that defines if an indicador has a map or not
//  *             type: int
//  *             example: 1
//  *             readOnly: true
//  *           Modulo:
//  *             $ref: '#/components/schemas/Modulo'
//  *           CoberturaGeografica:
//  *             $ref: '#/components/schemas/CoberturaGeografica'
//  *           UnidadMedida:
//  *             $ref: '#/components/schemas/UnidadMedida'                    
//  */


// /**
//  * @swagger
//  *   /indicadores/{id}:
//  *     get:
//  *       summary: Indicador object
//  *       description: Returns a singular indicador by id
//  *       tags: [Indicadores]
//  *       parameters:
//  *         - name: idIndicador
//  *           in: path
//  *           required: true
//  *           schema:
//  *             type: integer
//  *             format: int64
//  *              minimum: 1
//  *       responses:
//  *         200:
//  *           description: Indicador object
//  *           content:
//  *             application/json:
//  *               schema:
//  *                 $ref: '#/components/schemas/Indicadors'
//  */

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

indicadorRouter.route('/:idIndicador')
    .get(paramValidationRules(),
        validate,
        getIndicador);


module.exports = indicadorRouter;