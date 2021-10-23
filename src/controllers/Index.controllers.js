const { Usuario } = require('../models/usuario');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
    Usuario.findAll()
        .then(usua => {
            console.log(usua)
            res.sendStatus(200)
        })
        .catch(err => console.log(err))
}

const createUser = async (req, res) => {
    const {
        id,
        correo,
        clave,
        nombres,
        apellidopaterno,
        apellidomaterno,
        avatar,
        activo,
        fechacreacion,
        fechamodificacion
    } = req.body

    let errors = []

    if (!correo) {
        errors.push({ text: 'por favor agrega un correo' })
    }
    if (!clave) {
        errors.push({ text: 'por favor agrega una clave' })
    }
    if (!nombres) {
        errors.push({ text: 'por favor agrega un nombre' })
    }
    if (!apellidopaterno) {
        errors.push({ text: 'por favor agrega apellido paterno' })
    }
    if (!activo) {
        errors.push({ text: 'por favor especifica si esta activo' })
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });

    } else {

        Usuario.create({
            id,
            correo,
            clave,
            nombres,
            apellidopaterno,
            apellidomaterno,
            avatar,
            activo,
            fechacreacion,
            fechamodificacion

        })
            .catch(err => console.log(err))
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
    createUser
};