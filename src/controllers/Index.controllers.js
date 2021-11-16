// TODO: Add pagination
// TODO: Return error if email is already in use (when creating new user)
// TODO: change like for eq

const { Usuario } = require('../models/usuario');
const { getUsuarioByCorreo, addUsuario, isCorreoAlreadyInUse } = require('../services/usuariosService');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SALT_ROUNDS = 10;

const getUsers = async (req, res) => {
    Usuario.scope('withoutPassword').findAll()
        .then(usua => {
            console.log(usua)
            res.sendStatus(200)
        })
        .catch(err => console.log(err))
}

const createUser = async (req, res) => {
    const {
        correo,
        clave,
        nombres,
        apellidopaterno,
        apellidomaterno,
    } = req.body;
    try {
        if (await isCorreoAlreadyInUse(correo)) {
            return res.status(403).json({ message: 'correo already in use' })
        }

        const hashedClave = await bcrypt.hash(clave, SALT_ROUNDS);
        const savedUser = await addUsuario({
            correo,
            clave: hashedClave,
            nombres,
            apellidopaterno,
            apellidomaterno
        });
        return res.status(201).json(savedUser);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const deleteUser = async (req, res) => {

}

const editUser = async (req, res) => {

}

const findUser = async (req, res) => {
    let { term } = req.query

    term = term.toLowerCase()

    Usuario.findAll({ where: { id: { [Op.like]: '%' + term + '%' } } })
        .then(usua => res.render('index', { usua }))
        .catch(err => console.log(err))
}

module.exports = {
    getUsers,
    createUser,
    findUser
};