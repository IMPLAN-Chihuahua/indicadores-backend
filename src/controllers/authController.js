const { Usuario } = require('../models/usuario');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const login = async (req, res) => {

    // verificar si hay errores en la peticion
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { correo, clave } = req.body;

    const existingUser = await Usuario.findOne({ where: { correo: correo } });
    
    // comparar hashes de clave en peticion con la que se encuentra en la bd
    if (existingUser && await bcrypt.compare(clave, existingUser.clave)) {

        // no dar acceso si la cuenta esta desactivada
        if (existingUser.activo === 'NO') {
            return res.status(403).json({
                msg: "Esta se encuentra desactivada"
            });
        }

        // si coinciden regresar token con expiracion de 5hrs
        const token = jwt.sign(
            { usuario_id: existingUser.id },
            TOKEN_SECRET,
            { expiresIn: '5h' }
        );
        return res.status(200).json({ token });

    } else {
        return res.status(400).json("Credenciales invalidas");
    }
};

module.exports = { login };