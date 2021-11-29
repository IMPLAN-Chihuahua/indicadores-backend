const { Usuario } = require('../models/usuario');
const { addUsuario, getUsuarios, isCorreoAlreadyInUse, getUsuarioById } = require('../services/usuariosService');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SALT_ROUNDS = 10;

const getUsers = async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 25;

    try {
        const usuarios = await getUsuarios(perPage, (page - 1) * perPage);
        if (usuarios) {
            const total = usuarios.count;
            const totalPages = Math.ceil(total / perPage);

            res.status(200).json({
                page: page,
                per_page: perPage,
                total: total,
                total_pages: totalPages,
                data: [...usuarios.rows]
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

const getUser = async (req, res) => {
    const { id } = req.params

    try {
        const usuario = await getUsuarioById(id);
        if (usuario) {
            res.status(200).json({ usuario: usuario });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


// TODO: create function inside service to handle searching and filtering
const searchUser = async (req, res) => {
    const { term } = req.query

    term = term.toLowerCase()

    Usuario.findAll({ where: { id: { [Op.like]: '%' + term + '%' } } })
        .then(usua => res.render('index', { usua }))
        .catch(err => console.log(err))
}

module.exports = {
    getUsers,
    createUser,
    getUser
};