const express = require('express');
const router = express.Router();
const db = require('../config/db')
const usu = require('../models/usuario')
const usuario = usu.Usuario

const { getUsers, createUser, getindex, createUsu, gethome} = require('../controllers/Index.controllers')

router.get('/', getindex)

router.get('/users', getindex)
router.get('/home', gethome)
router.get('/add', createUsu)
router.post('/add', createUser)



module.exports = router;