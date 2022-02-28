const jwt = require('jsonwebtoken');
const { getRol } = require('../services/usuariosService');
require('dotenv').config();
const { TOKEN_SECRET } = process.env;

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

const verifyRoles = (roles) => {
    return async (req, res, next) => {
        const rol = await getRol(req.sub);
        const isAllowed = roles.includes(rol);
        if (isAllowed) {
            req.rol = rol;
            next();
        } else {
            return res.status(403).json({message: 'Su rol no tiene permiso a este recurso'});
        }
    }
};


module.exports = { verifyJWT, verifyRoles };