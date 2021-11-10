// TODO: Add validation rules to GET /usuarios (accept parameters limit, offset, etc)
const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/Index.controllers');
const { verifyJWT } = require('../middlewares/auth');
const {
    registerValidationRules,
    validate } = require('../middlewares/validator');

/**
 * @swagger
 *   /usuarios:
 *     get:
 *       summary: Retrieve a list of users
 *       description: Retrieve a list of users with pagination
 *       tags: [Usuarios]
 *       responses: 
 *         200:
 *           description: A list of users
 *         403:
 *           description: Unauthorized request (not valid JWT in Authorization header)
 *         422:
 *           description: Unable to process request due to semantic errors in the body or param payload
 *       
 */
router.get('/', verifyJWT, getUsers);

/**
 * @swagger
 *   /usuarios:
 *     post:
 *       summary: Register new user
 *       tags: [Usuarios]
 */
router.post('/', registerValidationRules(), validate, createUser);


module.exports = router;