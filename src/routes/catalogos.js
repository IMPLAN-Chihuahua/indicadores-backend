const express = require('express');
const catalogoRouter = express.Router();

const { getCatalogos, getCatalogosDetails } = require('../controllers/catalogoController');
const {
  paramValidationRules,
  validate,
} = require('../middlewares/validator/generalValidator')

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
 *           description: List of catalogos
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
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */

catalogoRouter.route('/')
  .get(getCatalogos);

/**
 * @swagger
 *   /catalogos/{idCatalogo}:
 *     get:
 *       summary: Retrieve details from a catalogo
 *       description: Return list of details related to a catalogo
 *       tags: [ Catalogos ]
 *       parameters:
 *         - in: path
 *           name: idCatalogo
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: List of details of a catalogo
 *         422: 
 *           $ref: '#/components/responses/UnprocessableEntity'
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */
catalogoRouter.route('/:idCatalogo')
  .get(
    paramValidationRules(),
    validate,
    getCatalogosDetails
  );
  

module.exports = catalogoRouter;