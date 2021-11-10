const { Usuario } = require('../models/usuario');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { correo, clave } = req.body;

        const existingUser = await Usuario.findOne({ where: { correo } });

        // compare existing user hashed clave against the hash of the clave in the request
        if (existingUser && await bcrypt.compare(clave, existingUser.clave)) {

            // if account is inactive return forbidden (status code)
            if (existingUser.activo === 'NO') {
                return res.status(403).json({
                    msg: "La cuenta se encuentra desactivada"
                });
            }

            // create and sign token (valid up to 5hrs)
            const token = jwt.sign(
                { usuario_id: existingUser.id },
                TOKEN_SECRET,
                { expiresIn: '5h' }
            );
            return res.status(200).json({ token });

        } else {
            return res.status(400).json("Credenciales invalidas");
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = { login };