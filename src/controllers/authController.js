const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUsuarioByCorreo, getUsuarioById, updateUserPassword, updateUserPasswordStatus } = require('../services/usuariosService');
require('dotenv').config();

const { TOKEN_SECRET } = process.env;

const { sendEmail } = require('../services/emailSenderService');
const SALT_ROUNDS = 10;

const login = async (req, res) => {
    try {
        const { correo, clave } = req.body;

        const existingUser = await getUsuarioByCorreo(correo);

        // compare existing user hashed clave against the hash of the clave in the request
        if (existingUser && await bcrypt.compare(clave, existingUser.clave)) {
            // denied access if account is disabled (status code)
            if (existingUser.activo === 'NO') {
                return res.status(403).json({
                    message: "La cuenta se encuentra deshabilitada"
                });
            }

            // create and sign token (valid up to 5hrs)
            const token = jwt.sign(
                { sub: existingUser.id },
                TOKEN_SECRET,
                { expiresIn: '5h' }
            );
            return res.status(200).json({ token });

        }
        return res.status(401).json({ message: "Credenciales invalidas" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

const generatePasswordRecoveryToken = async (req, res) => {
    try {
        const { correo } = req.body;
        const existingUser = await getUsuarioByCorreo(correo);
        if (existingUser) {
            const token = jwt.sign(
                { sub: existingUser.id },
                TOKEN_SECRET,
                { expiresIn: '2h' }
            );

            if (existingUser.requestedPasswordChange === 'NO') {
                const updater = await updateUserPasswordStatus(existingUser.id);
            }
            const sender = await sendEmail(existingUser, token);
            if (sender) {
                return res.status(200).json({ message: 'Se ha enviado un correo de recuperación de contraseña' });
            }
        }
        return res.status(404).json({ message: "El usuario no existe" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

const handlePasswordRecoveryToken = async (req, res) => {
    try {
        const token = req.matchedData.token;
        const { password } = req.body;
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const user = await getUsuarioById(decoded.sub);
        if (password && user && user.requestedPasswordChange === 'SI') {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const updatePassword = await updateUserPassword(user.id, hashedPassword);
            const changeStatus = await updateUserPasswordStatus(user.id);
            if(updatePassword && changeStatus) {
                return res.status(200).json({ message: "Contraseña actualizada" });
            }
            return res.status(400).json({ message: "Error al actualizar contraseña" });
        }

        if(user.requestedPasswordChange === 'NO') {
            return res.status(401).json({ message: "El usuario no ha solicitado un cambio de contraseña" });
        }

        return res.status(401).json({ message: "Token invalido" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { login, generatePasswordRecoveryToken, handlePasswordRecoveryToken };