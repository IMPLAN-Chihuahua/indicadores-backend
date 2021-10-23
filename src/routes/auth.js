const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/login',
    check('correo').isEmail(),
    check('clave')
        .exists()
        .isLength({ min: 8 }),
    authController.login);

module.exports = router;