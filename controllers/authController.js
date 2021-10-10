// TODO: Validar datos con joi o express-validator
// TODO: decidir que paquete utilizar brcypt o bcryptjs

const { Usuario } = require('../models/usuario');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const login = async (req, res) => {

    // obtener correo y clave de los parametros del body
    const { correo, clave } = req.body;

    // validacion basica
    if (!correo || !clave) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    const existingUser = await Usuario.findOne({ where: { correo: correo } });

    // await de bcrypt.compare() regresa un boolean
    if (existingUser
        && (await bcrypt.compare(clave, existingUser.clave))) {

        const token = jwt.sign(
            { usuario_id: existingUser.id, correo: existingUser.correo },
            TOKEN_SECRET,
            { expiresIn: '2h' }
        );
        return res.status(200).json({ token: token });
    } else {
        return res.status(400).json("Invalid credentials");
    }
};

module.exports = { login };