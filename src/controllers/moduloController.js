const moduloService = require('../services/moduloService');
const { Modulo } = require('../models');
const logger = require('../config/logger');

const getModulos = async (req, res, next) => {
  try {
    const modulos = await moduloService.getModulos();
    return res.status(200).json({ data: [...modulos] });
  } catch (err) {
    next(err);
  }
};


const createModulo = async (req, res, next) => {
  const {
    temaIndicador,
    observaciones,
    activo,
    codigo,
    descripcion,
    color,
  } = req.matchedData;
  let urlImagen = '';
  if (process.env.NODE_ENV === 'production') {
    urlImagen = req.file.location;
  } else if (req.file) {
    urlImagen = `http://${req.headers.host}/${req.file.path}`;
  }
  try {
    if (await moduloService.isTemaIndicadorAlreadyInUse(temaIndicador)) {
      return res.status(409).json({
        status: 409,
        message: `El tema indicador ${temaIndicador} ya está en uso`,
      });
    }
    const savedModulo = await moduloService.addModulo({
      temaIndicador,
      observaciones,
      activo,
      codigo,
      urlImagen,
      descripcion,
      color,
    });
    return res.status(201).json({ data: savedModulo });
  } catch (err) {
    next(err);
  }
};


const getAllModulos = async (req, res, next) => {
  const page = req.matchedData.page || 1;
  const perPage = req.matchedData.perPage || 15;
  try {
    const { modulos, total, totalInactivos } = await moduloService.getAllModulos(page, perPage, req.matchedData);
    const totalPages = Math.ceil(total / perPage);
    return res.status(200).json({
      page,
      perPage,
      totalPages,
      total,
      totalInactivos,
      data: modulos
    });
  } catch (err) {
    next(err);
  }
};


const editModulo = async (req, res, next) => {
  const fields = req.matchedData;
  const { idModulo } = req.matchedData;
  try {
    const updatedModulo = await moduloService.updateModulo(idModulo, fields);
    if (updatedModulo) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400);
  } catch (err) {
    next(err);
  }
}


const editUserStatus = async (req, res, next) => {
  const { idModulo } = req.matchedData;
  try {
    const updated = await moduloService.updateModuloStatus(idModulo);
    if (updated) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400)
  } catch (err) {
    next(err);
  }
};


const getModulo = async (req, res, next) => {
  const { idModulo } = req.matchedData;
  try {
    const modulo = await Modulo.findByPk(idModulo);
    if (modulo === null) {
      return res.sendStatus(404);
    }
    if (modulo.activo === 'NO') {
      return res.sendStatus(204)
    }
    return res.status(200).json({ data: { ...modulo.dataValues } });
  } catch (err) {
    next(err);
  }
}


module.exports = { getModulos, createModulo, editModulo, getAllModulos, updateModuloStatus: editUserStatus, getModulo }