// TODO: Add operations that call table Usuario here

const { Usuario } = require('../models/usuario');


const insertUser = async (user) => {

};

// select user by id or email
const selectUser = async (id, correo = "") => {
    let usuario = null;
    if (id) {
        usuario = await Usuario.findOne({ where: { id } });
    } else if (correo) {
        usuario = await Usuario.findOne({ where: { correo } });
    }
    return usuario;
};


module.exports = {
    insertUser,
    selectUser
}