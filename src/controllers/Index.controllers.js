const db = require('../config/db')
const usu = require('../models/usuario')
const usuario = usu.Usuario
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const  getUsers = async(req, res) => { 
    
    usu.Usuario.findAll()
        .then(usua => {
            console.log(usua) 
            res.sendStatus(200)})
        .catch(err => console.log(err))
    
}

const getindex = async(req, res) => 
usuario.findAll()
    .then(usua =>{
    res.render('index', {
        usua
    })
    })
    .catch(err => console.log(err))

const gethome = async(req,res) =>{
    res.render('home')
}
  
const createUsu = async(req, res)=>{
    res.render('add')
}

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
    
    let errors=[]

    if(!correo){
        errors.push({ text: 'por favor agrega un correo'})
    }
    if(!clave){
        errors.push({ text: 'por favor agrega una clave'})
    }
    if(!nombres){
        errors.push({ text: 'por favor agrega un nombre'})
    }
    if(!apellidopaterno){
        errors.push({ text: 'por favor agrega apellido paterno'})
    }
    if(!activo){
        errors.push({ text: 'por favor especifica si esta activo'})
    }

    if(errors.length>0){
        res.render('add',{
            errors,
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

    } else {

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
            .catch(err => console.log(err))

    }


}

const deleteUser = async(req, res)=>{

}

const editUser = async(req, res)=>{

}

const findUser = async(req, res)=>{
    let { term } = req.query
    
    term = term.toLowerCase()

    usu.Usuario.findAll({where:{id: {[Op.like]:'%' + term + '%' } } })
    .then(usua => res.render('index', {usua}))
    .catch(err => console.log(err) )

}
module.exports = {
    getUsers,
    createUser,
    getindex,
    createUsu,
    gethome
};