const { addUsuario,
    getUsuarios,
    isCorreoAlreadyInUse,
    getUsuarioById,
    updateUsuario } = require('../services/usuariosService');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SALT_ROUNDS = 10;

const getUsers = async (req, res) => {
    const page = req.matchedData.page || 1;
    const perPage = req.matchedData.per_page || 25;
    
    try {
        const { usuarios, total } = await getUsuarios(perPage, (page - 1) * perPage);
        const totalPages = Math.ceil(total / perPage);

        return res.status(200).json({
            page: page,
            per_page: perPage,
            total: total,
            total_pages: totalPages,
            data: [...usuarios]
        });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const createUser = async (req, res) => {
    const {
        correo,
        clave,
        nombres,
        apellidoPaterno,
        apellidoMaterno,
    } = req.body;
    try {
        if (await isCorreoAlreadyInUse(correo)) {
            return res.status(403).json({ message: 'Correo no disponible' })
        }

        const hashedClave = await bcrypt.hash(clave, SALT_ROUNDS);
        const savedUser = await addUsuario({
            correo,
            clave: hashedClave,
            nombres,
            apellidoPaterno,
            apellidoMaterno
        });
        return res.status(201).json(savedUser);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}
const editUser = async (req, res) => {
    const fields = req.body;
    const { id } = req.params;
    try {
        if (await updateUsuario(id, fields)) {
            return res.sendStatus(204);
        } else {
            return res.sendStatus(400);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUserFromId = async (req, res) => {
    const id = req.matchedData.idUser;
    return await getUser(req, res, id)
};

const getUserFromToken = async (req, res) => {
    const id = req.sub;
    return await getUser(req, res, id);
};

const getUser = async(req, res, id) => {
    try {
        const usuario = await getUsuarioById(id);
        if (usuario === null) {
            return res.sendStatus(204);
        } else {
            return res.status(200).json({ data: usuario });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getUsers,
    createUser,
    getUser,
    editUser,
    getUserFromId,
    getUserFromToken
};