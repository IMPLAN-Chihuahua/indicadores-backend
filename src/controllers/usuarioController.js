const bcrypt = require('bcrypt');
const { addUsuario,
    getUsuarios,
    isCorreoAlreadyInUse,
    getUsuarioById,
    updateUsuario,
    countInactiveUsers } = require('../services/usuariosService');
require('dotenv').config();

const SALT_ROUNDS = 10;

const getUsers = async (req, res) => {
    const page = req.matchedData.page || 1;
    const perPage = req.matchedData.perPage || 25;
    const { searchQuery } = req.matchedData;
    
    try {
        const { usuarios, total } = await getUsuarios(perPage, (page - 1) * perPage, searchQuery);
        const totalInactivos = await countInactiveUsers();
        const totalPages = Math.ceil(total / perPage);

        return res.status(200).json({
            page,
            perPage: perPage,
            total,
            totalPages: totalPages,
            totalInactivos,
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
        activo
    } = req.matchedData;
    const avatar = `images/${req.file ? req.file.originalName : 'avatar.jpg'}`;
    try {
        if (await isCorreoAlreadyInUse(correo)) {
            return res.status(409).send('Correo no disponible')
        }
        const hashedClave = await bcrypt.hash(clave, SALT_ROUNDS);
        const savedUser = await addUsuario({
            correo,
            clave: hashedClave,
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            activo,
            avatar
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
        }
        return res.sendStatus(400);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUser = async (req, res, id) => {
    try {
        const usuario = await getUsuarioById(id);
        if (usuario === null) {
            return res.sendStatus(204);
        }
        return res.status(200).json({ data: usuario });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUserFromId = async (req, res) => {
    const id = req.matchedData.idUser;
    return getUser(req, res, id)
};

const getUserFromToken = async (req, res) => {
    const id = req.sub;
    return getUser(req, res, id);
};

module.exports = {
    getUsers,
    createUser,
    getUser,
    editUser,
    getUserFromId,
    getUserFromToken
};