const express = require('express');
const catalogoRouter = express.Router();

const { getCatalogos } = require('../controllers/catalogoController');

/**
 * @swagger
 *   components:
 *     schemas:
 *       Ods:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             description: Identifier of an Ods
 *             example: 1
 *             readOnly: true
 *           nombre:
 *             type: string
 *             description: Name of the Ods
 *             example: Hambre cero
 *             readOnly: true
 *       CoberturaGeografica:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             description: Identifier of a Cobertura
 *             example: 1
 *             readOnly: true
 *           nombre:
 *             type: string
 *             description: Name of the Cobertura
 *             example: Urbana
 *             readOnly: true
 *       UnidadMedida:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             description: Identifier of an UnidadMedida
 *             example: 1
 *             readOnly: true
 *           nombre:
 *             type: string
 *             description: Name of the UnidadMedida
 *             example: "Kilometros"
 *             readOnly: true
 * */

/**
 * @swagger
 *   /catalogos:
 *     get:
 *       summary: Get a list of catalogos
 *       description: Returns a list of catalogs containing information about Ods, CoberturaGeografica and UnidadMedida
 *       tags: [Catalogos]
 *       responses:
 *         200:
 *           description: A very friendly list of catalogos returned by the API
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   ods:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Ods'
 *                     description: List of Ods
 *                   coberturaGeografica:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/CoberturaGeografica'
 *                     description: List of CoberturaGeografica
 *                   unidadMedida:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/UnidadMedida'
 *                     description: List of UnidadMedida
 *         500:
 *           description: Internal server error           
 */

catalogoRouter.route('/')
    .get(getCatalogos);



module.exports = catalogoRouter;