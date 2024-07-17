const { Mapa } = require('../models');
const { getImagePathLocation } = require('../utils/stringFormat');

const getMapaOfIndicador = async (req, res, next) => {
  const { idIndicador } = req.matchedData;
  try {
    const mapa = await Mapa.findOne({ where: { idIndicador } });
    return res.status(200).json({ data: { ...mapa?.dataValues } });
  } catch (err) {
    next(err)
  }
}

const createMapa = async (req, res, _next) => {
  const { idIndicador, ...values } = req.matchedData;
  const image = getImagePathLocation(req)

  const created = await Mapa.create({ ...values, ...image });

  return res.status(201).json({ data: created });

}

const updateMapa = async (req, res, _next) => {
  const { idMapa, ...values } = req.matchedData;
  const image = getImagePathLocation(req);

  await Mapa.update(
    { ...values, ...image }, {
    where: { id: idMapa }
  });

  return res.sendStatus(204)
}


module.exports = { getMapaOfIndicador, createMapa, updateMapa };