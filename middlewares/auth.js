const jwt = require('jsonwebtoken');
require('dotenv').config();
const { TOKEN_SECRET } = process.env.TOKEN_SECRET;

// verifica que peticion tenga un token valido
const verifyJWT = (req, res, next) => {
    const reqHeader = req.headers.authorization;
    if (reqHeader) {
        const bearerToken = reqHeader.split(' ')[1];
        jwt.verify(berarToken, TOKEN_SECRET, (err, user) => {

        });
    } else {
        res.sendStatus(401); // peticion no tiene datos en el header de authorization
    }
};

const verifyRole = () => {

};


module.exports = { verifyJWT };