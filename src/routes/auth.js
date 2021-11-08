const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { loginValidationRules, validate } = require('../middlewares/validator')


/**
 * @swagger
 *   /login:
 *     post:
 *       summary: returns jwt if credentials are correct
 *       tags: [ Auth ]
 */
router.post('/login', loginValidationRules(), validate, login);

module.exports = router;