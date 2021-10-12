const db = require('../config/db')
const usu = require('../models/usuario')
const usuario = usu.Usuario

const  getUsers = async(req, res) => { 
    
    usu.Usuario.findAll()
        .then(usua => {
            console.log(usua) 
            res.sendStatus(200)})
        .catch(err => console.log(err))
    
}

const getindex = async(req, res) => 
  res.render('index')


const createUser = async(req, res)=>{
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

    usu.Usuario.create({
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
        .then(usua => res.send('User created'))
        .catch(err => console.log(err))

}

const deleteUser = async(req, res)=>{

}

const editUser = async(req, res)=>{

}

const findUser = async(req, res)=>{
    
}
module.exports = {
    getUsers,
    createUser,
    getindex
};