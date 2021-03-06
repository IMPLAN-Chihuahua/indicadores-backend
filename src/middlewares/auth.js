const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getRol, isUserActive } = require('../services/usuariosService');
require('dotenv').config();

const { TOKEN_SECRET } = process.env;
const SALT_ROUNDS = 10;
const TOKEN_EXPIRATION_TIME = '5h';

// verifica que peticion tenga un token valido
const verifyJWT = (req, res, next) => {
    const reqHeader = req.headers.authorization;
    if (reqHeader) {
        const bearerToken = reqHeader.split(' ')[1];
        jwt.verify(bearerToken, TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send('Invalid or expired token');
            }
            req.sub = decoded.sub;
            next();
        });
    } else {
        // peticion no tiene datos en el header de authorization
        return res.sendStatus(401);
    }
};

const verifyUserHasRoles = (roles) => async (req, res, next) => {
    const rol = await getRol(req.sub);
    const isAllowed = roles.includes(rol);
    if (isAllowed) {
        req.rol = rol;
        next();
    } else {
        return res.status(403).send('No tiene permiso a realizar acciones en este recurso');
    }
};

const verifyUserIsActive = async (req, res, next) => {
    if (await isUserActive(req.sub)) {
        next();
    } else {
        return res.status(403).send('Esta cuenta se encuentra deshabilitada');
    }
}

const hashClave = (clave) => bcrypt.hash(clave, SALT_ROUNDS);

const generateToken = (payload) => jwt.sign({ ...payload }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });

module.exports = {
    verifyJWT,
    verifyUserHasRoles,
    hashClave,
    generateToken,
    verifyUserIsActive
};