const express = require('express');
const router = express.Router();

const {
    sortValidationRules
} = require('../middlewares/validator/indicadorValidator')

const {
    paginationValidationRules,
    paramValidationRules,
    validate,
} = require('../middlewares/validator/generalValidator')

const {
    updateHistoricoValidationRules,
    createHistoricoValidationRules,
} = require('../middlewares/validator/historicoValidator');

const {
    getHistoricos,
    deleteHistorico,
    updateHistorico,
    createHistorico,
} = require('../controllers/historicoController');
const { verifyJWT, verifyUserIsActive } = require('../middlewares/auth');

/**
 * @swagger
 * /historicos/indicador/{idIndicador}:
 *   get:
 *     summary: Get a list of historicos from an indicador
 *     description: Get a list of historicos from an indicador
 *     tags: [Historicos]
 *     security:
 *       - bearer: []
 *     parameters:
 *       - name: idIndicador
 *         in: path
 *         required: true
 *         description: The id of the indicador
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *     responses:
 *       200:
 *         description: List of historicos from an indicador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Historico'
 *       400:
 *         $ref: '#/components/responses/BasicError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 */

router.route('/indicador/:idIndicador')
    .get(
        verifyJWT,
        verifyUserIsActive,
        paginationValidationRules(),
        sortValidationRules(),
        paramValidationRules(),
        validate,
        getHistoricos
    );


/**
 * @swagger
 * /historicos/{idHistorico}:
 *   delete:
 *     summary: Delete a historico
 *     description: Delete a historico using its id
 *     tags: [Historicos]
 *     security:
 *       - bearer: []
 *     parameters:
 *       - name: idHistorico
 *         in: path
 *         required: true
 *         description: The id of the historico
 *         schema:
 *           type: integer
 *         format: int64
 *         minimum: 1
 *     responses:
 *       200:
 *         description: The historico was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Historico'
 *       400:
 *         $ref: '#/components/responses/BasicError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 */

router.route('/:idHistorico')
    .delete(
        verifyJWT,
        verifyUserIsActive,
        paramValidationRules(),
        validate,
        deleteHistorico
    );

router.route('/:idHistorico')
    .patch(
        verifyJWT,
        verifyUserIsActive,
        updateHistoricoValidationRules(),
        paramValidationRules(),
        validate,
        updateHistorico
    );

router.route('/:idIndicador')
    .post(
        verifyJWT,
        verifyUserIsActive,
        createHistoricoValidationRules(),
        validate,
        createHistorico
    );

module.exports = router;