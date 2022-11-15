const moduloService = require('../services/moduloService');
const { Modulo } = require('../models');
const logger = require('../config/logger');
const { getImagePathLocation } = require('../utils/stringFormat');

const getModulos = async (req, res, next) => {
  try {
    const modulos = await moduloService.getModulos();
    return res.status(200).json({ data: [...modulos] });
  } catch (err) {
    next(err);
  }
};


const createModulo = async (req, res, next) => {
  const values = req.matchedData;
  const image = getImagePathLocation(req);
  try {
    if (await moduloService.isTemaIndicadorAlreadyInUse(values.temaIndicador)) {
      return res.status(409).json({
        status: 409,
        message: `${values.temaIndicador} is already in use`,
      });
    }
    const savedModulo = await moduloService.addModulo({ ...values, ...image });
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
  const { idModulo, ...fields } = req.matchedData;
  const image = getImagePathLocation(req);
  try {
    const updatedModulo = await moduloService.updateModulo(idModulo, { ...fields, ...image });
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