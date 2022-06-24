const { hashClave } = require('../middlewares/auth');
const { createRelation } = require('../services/usuarioIndicadorService');
const { addUsuario,
  getUsuarios,
  isCorreoAlreadyInUse,
  getUsuarioById,
  updateUsuario,
  updateUserStatus,
  countInactiveUsers } = require('../services/usuariosService');
require('dotenv').config();

const getUsers = async (req, res, next) => {
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
    next(err)
  }
}

const createUser = async (req, res, next) => {
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
    next(err)
  }
}

const editUser = async (req, res, next) => {
  let urlImagen = '';
  const idFromToken = req.sub;
  const fields = req.body;
  const { idUser } = req.params;

  urlImagen = req.file ? `images/user/${req.file.filename}` : urlImagen;

  let fieldsWithImage = {};

  if (urlImagen) {
    fieldsWithImage = {
      ...fields,
      urlImagen
    };
  } else {
    fieldsWithImage = {
      ...fields
    };
  }

  if (idUser) {
    try {
      if (await updateUsuario(idUser, fieldsWithImage)) {
        return res.sendStatus(204);
      }
      return res.sendStatus(400);
    } catch (err) {
      next(err)
    }
  }
  else {
    try {
      if (fields.id === idFromToken) {
        if (await updateUsuario(fields.id, fieldsWithImage)) {
          return res.sendStatus(204);
        }
        return res.sendStatus(400);
      }
      return res.sendStatus(401);

    } catch (err) {
      next(err)
    }
  }
}

const editUserStatus = async (req, res, next) => {
  const { idUser } = req.params;
  try {
    const updatedUser = await updateUserStatus(idUser);
    if (updatedUser) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400);
  } catch (err) {
    next(err)
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
    throw err;
  }
}

const getUserFromId = async (req, res, next) => {
  console.log('ekekekeke');
  const id = req.matchedData.idUser;
  try {
    return await getUser(req, res, id)
  } catch (err) {
    next(err)
  }
};

const getUserFromToken = async (req, res, next) => {
  const id = req.sub;
  try {
    return await getUser(req, res, id)
  } catch (err) {
    next(err)
  }
};

const setIndicadoresToUsuario = async (req, res, next) => {
  const { idUser: idUsuario, indicadores, desde, hasta } = req.matchedData;
  const updatedBy = req.sub;
  const createdBy = req.sub;
  try {
    await createRelation(
      [idUsuario],
      [...indicadores],
      {
        fechaDesde: desde,
        fechaHasta: hasta,
        createdBy,
        updatedBy
      });
    return res.sendStatus(201);
  } catch (err) {
    next(err)
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  editUser,
  editUserStatus,
  getUserFromId,
  getUserFromToken,
  setIndicadoresToUsuario
};