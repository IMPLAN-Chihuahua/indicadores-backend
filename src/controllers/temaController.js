const temaService = require('../services/temaService');
const { Tema } = require('../models');

const getPublicTemasController = async (req, res, next) => {
  try {
    const { perPage, page, sortBy, order, searchQuery, ...filters } = req.matchedData;
    const { temas, total } = await temaService.getPublicTemas({
      page,
      perPage,
      sortBy,
      order,
      searchQuery,
      filters
    });

    return res.status(200).json({
      data: temas,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    next(err);
  }
};


const createTema = async (req, res, next) => {
  const { urlImagen, ...values } = req.matchedData;


  try {
    if (await temaService.isTemaIndicadorAlreadyInUse(values.temaIndicador)) {
      return res.status(409).json({
        status: 409,
        message: `${values.temaIndicador} is already in use`,
      });
    }
    const savedTema = await temaService.addTema({ ...values, urlImagen: urlImagen || null });
    return res.status(201).json({ data: savedTema });
  } catch (err) {
    next(err);
  }
};


const getPrivateTemasController = async (req, res, next) => {
  const { page, perPage, searchQuery, sortBy, order, ...filters } = req.matchedData;

  try {
    const { temas, total, totalInactivos } = await temaService.getPrivateTemas({
      page,
      perPage,
      sortBy,
      order,
      searchQuery,
      filters
    });

    const totalPages = Math.ceil(total / perPage);
    return res.status(200).json({
      page,
      perPage,
      totalPages,
      total,
      totalInactivos,
      data: temas
    });
  } catch (err) {
    next(err);
  }
};


const editTema = async (req, res, next) => {
  const { idTema, urlImagen, ...fields } = req.matchedData;
  try {
    const updatedTema = await temaService.updateTema(idTema, { ...fields, urlImagen: urlImagen || null });
    if (updatedTema) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400);
  } catch (err) {
    next(err);
  }
}


const editUserStatus = async (req, res, next) => {
  const { idTema } = req.matchedData;
  try {
    const updated = await temaService.updateTemaStatus(idTema);
    if (updated) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400)
  } catch (err) {
    next(err);
  }
};


const getTema = async (req, res, next) => {
  const { idTema } = req.matchedData;

  try {
    const tema = await Tema.findByPk(idTema);

    if (tema === null) {
      return res.sendStatus(404);
    }
    if (tema.activo === false) {
      return res.status(409).json({ status: 409, message: `El tema ${tema.temaIndicador} se encuentra inactivo` });
    }
    return res.status(200).json({ data: { ...tema.dataValues } });
  } catch (err) {
    next(err);
  }
}


module.exports = { getPublicTemasController, createTema, editTema, getPrivateTemasController, updateTemaStatus: editUserStatus, getTema }