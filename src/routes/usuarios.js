const express = require('express');
const router = express.Router();
const { getUsers, createUser, getUser, editUser, deleteUser } = require('../controllers/usuarioController');
const { verifyJWT } = require('../middlewares/auth');
const {
    registerValidationRules,
    usuariosValidationRules,
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
 *         401:
 *           description: Unauthorized request (not valid JWT in Authorization header)
 *         422:
 *           description: Unable to process request due to semantic errors in the body or param payload
 *       
 */
router.get('/', getUsers);

/**
 * @swagger
 *   /usuarios:
 *     post:
 *       summary: Register new user
 *       tags: [Usuarios]
 */
router.post('/', registerValidationRules(), validate, createUser);


/**
 * @swagger
 *  /usuarios/{id}:
 *    get:
 *      summary: Get a user with a given id
 *      tags: [Usuarios]
 *      responses: 
 *        200:
 *          description: A user
 *        204:
 *          description: Not user was found with the given id
 *        401:
 *          description: Unauthorized request (not valid JWT in Authorization header)
 *        422:
 *          description: Unable to process request due to semantic errors in the body or param payload
 */
router.get('/:id', verifyJWT, getUser);


/**
 * @swagger
 *  /usuarios/{id}:
 *    patch:
 *      summary: Update user's information
 *      tags: [Usuarios]
 * 
 */
router.patch('/:id', editUser);


/**
 * @swagger
 *  /usuarios/{id}:
 *    delete:
 *      summary: Delete a user's account
 *      tags: [Usuarios]
 */
router.delete('/:id', deleteUser);

module.exports = router;