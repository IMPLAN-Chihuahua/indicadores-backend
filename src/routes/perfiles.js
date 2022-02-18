const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../controllers/usuarioController');
const { verifyJWT } = require('../middlewares/auth');
const { getIndicadoresFromUser } = require('../controllers/indicadorController');

router.route('/').get(verifyJWT, getUserFromToken);


router.route('/indicadores').get( verifyJWT, getIndicadoresFromUser );

module.exports = router;