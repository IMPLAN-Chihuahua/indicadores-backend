const express = require('express');
const router = express.Router();
const { paramValidationRules,
    validate,
    paginationValidationRules,
    sortValidationRules,
} = require('../middlewares/validator');
const {
    getHistoricos,
    deleteHistorico,
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

module.exports = router;