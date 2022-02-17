const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../controllers/usuarioController');
const { verifyJWT } = require('../middlewares/auth');


router.route('/').get(verifyJWT, getUserFromToken);

module.exports = router;