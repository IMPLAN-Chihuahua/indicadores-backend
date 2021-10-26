const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/Index.controllers');
const {
    registerValidationRules,
    validate } = require('../middlewares/validator');

router.get('/', getUsers);
router.post('/', registerValidationRules(), validate, createUser);

module.exports = router;