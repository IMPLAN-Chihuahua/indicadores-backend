const bcrypt = require('bcrypt');
const { hashClave } = require('../middlewares/auth');
const { addUsuario,
    getUsuarios,
    isCorreoAlreadyInUse,
    getUsuarioById,
    updateUsuario,
    updateUserStatus,
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
            perPage,
            total,
            totalPages,
            totalInactivos,
            data: [...usuarios]
        });
    } catch (err) {
        return res.status(500).json(err.message)
    }
}

const createUser = async (req, res) => {
    const {
        correo,
        clave,
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        activo,
        idRol
    } = req.matchedData;
    const avatar = `images/${req.file ? req.file.originalName : 'avatar.jpg'}`;
    try {
        if (await isCorreoAlreadyInUse(correo)) {
            return res.status(409).send('Correo no disponible')
        }
        const hashedClave = await hashClave(clave);
        const savedUser = await addUsuario({
            correo,
            clave: hashedClave,
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            activo,
            avatar,
            idRol
        });
        return res.status(201).json({ data: savedUser });
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

const editUser = async (req, res) => {
    let urlImagen = '';
    const idFromToken = req.sub;

    const fields = req.body;

    const { idUser } = req.params;

    console.log(req.file);

    urlImagen = req.file ? `images/user/${req.file.filename}` : urlImagen;

    let fieldsWithImage = {};

    if (urlImagen) {
        fieldsWithImage = {
            ...fields,
            urlImagen: urlImagen
        };
    } else {
        fieldsWithImage = {
            ...fields
        };
    }

    console.log(fieldsWithImage);

    if (idUser) {
        try {
            if (await updateUsuario(idUser, fieldsWithImage)) {
                return res.sendStatus(204);
            }
            return res.sendStatus(400);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    else {
        try {
            if (fields.id == idFromToken) {
                if (await updateUsuario(fields.id, fieldsWithImage)) {
                    return res.sendStatus(204);
                }
                return res.sendStatus(400);
            } else {
                return res.sendStatus(401);
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

const editUserStatus = async (req, res) => {
    const { idUser } = req.params;
    try {
        const updatedUser = await updateUserStatus(idUser);
        if (updatedUser) {
            return res.sendStatus(204);
        }
        return res.sendStatus(400);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const getUser = async (req, res, id) => {
    try {
        const usuario = await getUsuarioById(id);
        if (usuario === null) {
            return res.sendStatus(204);
        }
        return res.status(200).json({ data: usuario });
    } catch (err) {
        return res.status(500).send(err.message);
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
    editUserStatus,
    getUserFromId,
    getUserFromToken
};