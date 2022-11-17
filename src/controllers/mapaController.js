const { Mapa } = require('../models');
const { areConnected } = require('../services/usuarioIndicadorService');
const { getImagePathLocation } = require('../utils/stringFormat');

const getMapaOfIndicador = async (req, res, next) => {
  const { idIndicador } = req.matchedData;
  try {
    const mapa = await Mapa.findOne({ where: { idIndicador } });
    return res.status(200).json({ data: { ...mapa } });
  } catch (err) {
    next(err)
  }
}

const createMapa = async (req, res, next) => {
  const values = req.matchedData;
  const image = getImagePathLocation(req)
  try {
    if (req.rol !== 'ADMIN' && !(await areConnected(req.sub, values.idIndicador))) {
      return res.status(403).send('No tiene permiso para actualizar este indicador');
    }
    const created = await Mapa.create({ ...values, ...image });
    return res.status(201).json({ data: { ...created.dataValues } });
  } catch (err) {
    next(err)
  }
}


module.exports = { getMapaOfIndicador, createMapa };