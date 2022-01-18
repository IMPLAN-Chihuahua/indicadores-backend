const express = require('express');
const catalogoRouter = express.Router();

const { getOds, getCoberturaGeografica } = require('../controllers/catalogoController');

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
 *             example: Ods 1
 *             readOnly: true
 *           idIndicador:
 *             type: integer
 *             description: foreign key to indicador
 *             example: 1
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
 *             example: Cobertura 1
 *             readOnly: true
 *           idIndicador:
 *             type: integer
 *             description: foreign key to indicador
 *             example: 1
 *             readOnly: true
 * */

/**
 * @swagger
 *   /catalogos:
 *     get:
 *       summary: Get a list of Ods
 *       description: Returns a list of Ods from the database
 *       tags: [Ods]
 *       responses:
 *         200:
 *           description: A very friendly list of Ods
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
 *         500:
 *           description: Internal server error           
 */

catalogoRouter.route('/')
    .get(getOds);



module.exports = catalogoRouter;