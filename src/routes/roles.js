const express = require('express');
const router = express.Router();
const { getRoles } = require('../controllers/rolController.js');
const { verifyJWT } = require('../middlewares/auth');

router.get('/', getRoles);

module.exports = router;