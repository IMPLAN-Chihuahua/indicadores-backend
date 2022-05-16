const express = require('express');

const router = express.Router();
const { getRoles } = require('../controllers/rolController.js');

router.get('/', getRoles);

module.exports = router;