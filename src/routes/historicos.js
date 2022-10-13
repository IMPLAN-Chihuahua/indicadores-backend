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
const { verifyJWT, verifyUserHasRoles, verifyUserIsActive } = require('../middlewares/auth');
const { Router } = require('express');


router.route('/:idIndicador')
    .get(
        verifyJWT,
        verifyUserIsActive,
        paginationValidationRules(),
        sortValidationRules(),
        paramValidationRules(),
        validate,
        getHistoricos
    );

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