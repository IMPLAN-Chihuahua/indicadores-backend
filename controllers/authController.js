const { Usuario } = require('../models/usuario');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    // obtener correo y clave de los parametros del body
    const { correo, clave } = req.body;

    const existingUser = await Usuario.findOne({ where: { correo: correo } });

    if (existingUser && existingUser.activo === 'NO') {
        return res.status(403).json({
            msg: "This account is not active"
        });
    }

    // await de bcrypt.compare() regresa un boolean
    if (await bcrypt.compare(clave, existingUser.clave)) {
        const token = jwt.sign(
            { usuario_id: existingUser.id, correo: existingUser.correo },
            TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        return res.status(200).json({ token: token });
    } else {
        return res.status(400).json("Invalid credentials");
    }
};

module.exports = { login };