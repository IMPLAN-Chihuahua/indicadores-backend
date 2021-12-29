const express = require('express');
const router = express.Router();
const { getModulos } = require('../controllers/moduloController.js');

router.get('/', getModulos);

module.exports = router;
