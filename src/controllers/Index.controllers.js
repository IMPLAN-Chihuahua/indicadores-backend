// TODO: Add pagination
// TODO: Return error if email is already in use (when creating new user)
// TODO: change like for eq

const { Usuario } = require('../models/usuario');
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
    } = req.body

    bcrypt.hash(clave, SALT_ROUNDS)
        .then(hashedClave => {
            return Usuario.create({
                correo,
                clave: hashedClave,
                nombres,
                apellidopaterno,
                apellidomaterno
            });
        })
        .then(savedUser => {
            res.status(201).json({
                user: {
                    correo: savedUser.correo,
                    nombres: savedUser.nombres,
                    fechacreacion: savedUser.fechacreacion
                }
            })
        })
        .catch(err => console.log(err));
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