const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/login',
    body('correo').isEmail(),
    body('clave').isLength({ min: 8 }),
    authController.login);

module.exports = router;