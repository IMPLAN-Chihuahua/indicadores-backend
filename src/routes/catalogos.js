const express = require('express');
const catalogoRouter = express.Router();

const { getCatalogos, getCatalogosDetails, getCatalogosFromIndicador, updateOrCreateCatalogFromIndicador } = require('../controllers/catalogoController');

const {
	paramValidationRules,
	validate,
} = require('../middlewares/validator/generalValidator')

const {
	updateIndicadorCatalogos
} = require('../middlewares/validator/catalogoValidator');

const { verifyJWT, verifyUserIsActive } = require('../middlewares/auth');
const { updateOrCreateCatalogosFromIndicador } = require('../services/catalogosService');

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
 *         429:
 *           $ref: '#/components/responses/TooManyRequests'
 *         500:
 *           $ref: '#/components/responses/InternalServerError'
 */

catalogoRouter.route('/')
	.get(getCatalogos);

// TODO: PAGINATE THIS ENDPOINT
catalogoRouter.route('/:idCatalogo')
	.get(paramValidationRules(),
		validate,
		getCatalogosDetails);

catalogoRouter.route('/indicador/:idIndicador')
	.patch(
		verifyJWT,
		verifyUserIsActive,
		paramValidationRules(),
		updateIndicadorCatalogos(),
		validate,
		updateOrCreateCatalogFromIndicador,
	)

module.exports = catalogoRouter;