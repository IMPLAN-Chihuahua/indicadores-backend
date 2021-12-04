const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { loginValidationRules, validate } = require('../middlewares/validator')

/**
 * @swagger
 */

/**
 * @swagger
 *   /login:
 *     post:
 *       summary: Let a client log into the app
 *       description: If a request has valid credentials, this endpoint returns a JWT to use in every subsequent request
 *       requestBody:
 *         description: User's credentials
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       tags: [ Auth ]
 *       responses:
 *         200: 
 *           description: Returns a JWT if credentials were correct.
 *         422:
 *           description: Unable to process request due to semantic errors in the body or param payload
 */
router.post('/login', loginValidationRules(), validate, login);

module.exports = router;