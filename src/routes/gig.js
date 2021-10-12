const express = require('express');
const router = express.Router();
const db = require('../config/db')
const usu = require('../models/usuario')
const usuario = usu.Usuario

const { getUsers, createUser, getindex} = require('../controllers/Index.controllers')

router.get('/', getindex)

router.get('/users', getUsers)
router.get('/add', createUser)
router.post('/users', createUser)



module.exports = router;