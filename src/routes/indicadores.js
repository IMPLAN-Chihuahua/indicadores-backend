const express = require('express');
const indicadorRouter = express.Router({ mergeParams: true });
const { paramValidationRules, paginationValidationRules,
    validate, filterIndicadoresValidationRules, sortValidationRules } = require('../middlewares/validator');

const { getIndicador } = require('../controllers/indicadorController');

indicadorRouter.route('/:idIndicador')
    .get(paramValidationRules(),
        validate,
        getIndicador);


module.exports = indicadorRouter;