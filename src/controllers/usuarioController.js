const { Usuario } = require('../models/usuario');
const { addUsuario, getUsuarios, isCorreoAlreadyInUse } = require('../services/usuariosService');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SALT_ROUNDS = 10;

const getUsers = async (req, res) => {
    const page = req.query.page || 0;
    const perPage = req.query.per_page || 25;

    try {
        const usuarios = await getUsuarios(perPage, page * perPage);
        if (usuarios) {
            res.status(200).json({
                usuarios
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
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