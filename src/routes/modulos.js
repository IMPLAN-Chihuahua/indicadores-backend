const express = require('express');
const router = express.Router();
const { getModulos } = require('../controllers/moduloController');
const { getIndicadores} = require('../controllers/indicadorController');
const { paramValidationRules, validate } = require('../middlewares/validator');

router.get('/', getModulos);
router.get('/:id/indicadores',  paramValidationRules(), validate, getIndicadores);

module.exports = router;
