const express = require('express');
const router = express.Router();
const { paramValidationRules,
    validate,
    paginationValidationRules,
    sortValidationRules,
    updateHistoricoValidationRules,
} = require('../middlewares/validator');
const {
    getHistoricos,
    deleteHistorico,
    updateHistorico,
} = require('../controllers/historicoController');
const { verifyJWT, verifyUserHasRoles, verifyUserIsActive } = require('../middlewares/auth');


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

module.exports = router;