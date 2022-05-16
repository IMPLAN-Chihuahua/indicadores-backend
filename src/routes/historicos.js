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
const { verifyJWT, verifyRoles, verifyUserIsActive } = require('../middlewares/auth');


router.route('/:idIndicador')
    .get(
        verifyJWT,
        verifyUserIsActive,
        verifyRoles(['ADMIN', 'USER']),
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
        verifyRoles(['ADMIN', 'USER']),
        paramValidationRules(),
        validate,
        deleteHistorico
    );

router.route('/:idHistorico')
    .patch(
        verifyJWT,
        verifyUserIsActive,
        verifyRoles(['ADMIN', 'USER']),
        paramValidationRules(),
        updateHistoricoValidationRules(),
        validate,
        updateHistorico
    );

module.exports = router;