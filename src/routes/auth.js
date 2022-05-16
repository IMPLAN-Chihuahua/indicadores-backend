const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const { login, generatePasswordRecoveryToken, handlePasswordRecoveryToken } = require('../controllers/authController');
const { loginValidationRules, validate, tokenValidationRules } = require('../middlewares/validator')
/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearer:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */


/**
 * @swagger
 *   /auth/login:
 *     post:
 *       summary: Let a client log into the app
 *       description: If a request has valid credentials, this endpoint returns a JWT to use in every subsequent request
 *       requestBody:
 *         description: User's credentials
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correo:
 *                   type: string
 *                   example: johndoe@email.com
 *                 clave:
 *                   type: string
 *                   example: password
 *               required:
 *                 - correo
 *                 - clave
 *       tags: [ Auth ]
 *       responses:
 *         200: 
 *           description: Returns a JWT if credentials are correct.
 *         422:
 *           description: Unable to process request due to semantic errors in the body or param payload
 */
router.post('/login', loginValidationRules(), validate, login);

/**
 * @swagger
 *   /auth/password-reset:
 *     post:
 *       summary: Starts process to reset a password
 *       tags: [ Auth ]
 *       requestBody:
 *          description: User's email address
 *          required: true
 *          content:
 *            application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  correo:
 *                    type: string
 *                    example: johndoe@email.com
 *       responses:
 *         200:
 *           description: Sends an email to the address in the body request
 *         422:
 *           description: Unable to process request due to semantic errors in the body payload
 */
router.post('/password-reset',
  body('correo').trim().isEmail(),
  validate,
  generatePasswordRecoveryToken)

/**
 * @swagger
 *   /auth/password-reset/{token}:
 *     patch:
 *       summary: Updates password of a user
 *       tags: [ Auth ]
 *       parameters:  
 *         - in: path
 *           name: token
 *           required: false
 *       requestBody:
 *         description: New password
 *         required: true
 *         content: 
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 clave:
 *                   type: string 
 *                   example: newPassword
 *       responses:
 *         200:
 *           description: Updates password succesfully
 */
router.patch('/password-reset/:token?',
  tokenValidationRules(),
  validate,
  handlePasswordRecoveryToken)

module.exports = router;