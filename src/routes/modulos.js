const express = require('express');
const moduloRouter = express.Router();
const indicadorRouter = express.Router({ mergeParams: true });
const { getModulos } = require('../controllers/moduloController');
const { getIndicadores, getIndicador } = require('../controllers/indicadorController');
const { paramValidationRules, paginationValidationRules, validate } = require('../middlewares/validator');

moduloRouter.use('/:idModulo/indicadores', indicadorRouter);

moduloRouter.route('/')
    .get(getModulos);

indicadorRouter.route('/')
    .get(paramValidationRules(),
        paginationValidationRules(),
        validate,
        getIndicadores);

indicadorRouter.route('/:idIndicador')
    .get(paramValidationRules(),
        validate,
        getIndicador);

module.exports = moduloRouter;
