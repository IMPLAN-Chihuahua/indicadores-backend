const express = require('express');
const router = express.Router();
const { paramValidationRules,
    validate } = require('../middlewares/validator');
const { getIndicador } = require('../controllers/indicadorController');

router.route('/:idIndicador/:format?')
    .get(paramValidationRules(),
        validate,
        getIndicador);

module.exports = router;