const express = require('express');
const catalogoRouter = express.Router();

const Catalogos = require('../controllers/catalogoController');
const { paramValidationRules, validate } = require('../middlewares/validator');

const { verifyJWT } = require('../middlewares/auth');

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
    .get(Catalogos.getCatalogos);


/** ADMINISTRATIVE SECTION  */

catalogoRouter.route('/ods')
    .get(
        verifyJWT,
        Catalogos.getOds
    );

catalogoRouter.route('/ods/:idOds')
    .get(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.getOdsById
    );
   
catalogoRouter.route('/ods/:idOds')
    .patch(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.updateOds
    );

catalogoRouter.route('/ods')
    .post(
        verifyJWT,
        Catalogos.createOds);

catalogoRouter.route('/ods/:idOds')
    .delete(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.deleteOds);

// Cobertura geográfica
catalogoRouter.route('/cobertura')
    .get(
        verifyJWT,
        Catalogos.getCoberturas
    );

catalogoRouter.route('/cobertura/:idCobertura')
    .get(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.getCoberturaById
    );
   
catalogoRouter.route('/cobertura/:idCobertura')
    .patch(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.updateCobertura
    );

catalogoRouter.route('/cobertura')
    .post(
        verifyJWT,
        Catalogos.createCobertura);

catalogoRouter.route('/cobertura/:idCobertura')
    .delete(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.deleteCobertura);

// Unidad Medida
catalogoRouter.route('/unidadMedida')
    .get(
        verifyJWT,
        Catalogos.getUnidades
    );

catalogoRouter.route('/unidadMedida/:idUnidadMedida')
    .get(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.getUnidadById
    );
   
catalogoRouter.route('/unidadMedida/:idUnidadMedida')
    .patch(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.updateUnidad
    );

catalogoRouter.route('/unidadMedida')
    .post(
        verifyJWT,
        Catalogos.createUnidad);

catalogoRouter.route('/unidadMedida/:idUnidadMedida')
    .delete(
        verifyJWT,
        paramValidationRules(),
        validate,
        Catalogos.deleteUnidad);

module.exports = catalogoRouter;