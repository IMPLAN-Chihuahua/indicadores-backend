const express = require('express');
const router = express.Router();

const {
    paramValidationRules,
    validate,
    paginationValidationRules,
} = require('../middlewares/validator/generalValidator')

const {
    sortValidationRules
} = require('../middlewares/validator/usuarioIndicadorValidator')

const { verifyJWT, verifyUserIsActive } = require('../middlewares/auth');
const { getIndicadoresRelations } = require('../controllers/usuarioIndicadorController');

router.get(
    '/',
    paginationValidationRules(),
    sortValidationRules(),
    paramValidationRules(),
    validate,
    getIndicadoresRelations,
)

module.exports = router;