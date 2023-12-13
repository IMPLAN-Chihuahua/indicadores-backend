const { Mapa } = require('../models');
const { validate } = require('../services/authService');
const { getIdIndicadorRelatedTo } = require('../services/indicadorService');
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

const createMapa = async (req, res, next) => {
  const { idIndicador, ...values } = req.matchedData;
  const image = getImagePathLocation(req)
  const rol = req.rol;
  const idUsuario = req.sub;
  try {
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const created = await Mapa.create({ ...values, ...image });
        return res.status(201).json({ data: { ...created.dataValues } });
      },
      () => res.status(403).send('No tiene permiso para agregar el mapa al indicador')
    )
  } catch (err) {
    next(err)
  }
}

const updateMapa = async (req, res, next) => {
  const { idMapa, ...values } = req.matchedData;
  const image = getImagePathLocation(req);
  const rol = req.rol;
  const idUsuario = req.sub;
  try {
    const idIndicador = await getIdIndicadorRelatedTo(Mapa, idMapa);
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const affectedRows = await Mapa.update(
          { ...values, ...image }, {
          where: { id: idMapa }
        });
        return affectedRows > 0 ? res.sendStatus(204) : res.sendStatus(400);
      },
      () => res.status(403).send('No tiene permiso para actualizar el mapa del indicador')
    )
  } catch (err) {
    next(err)
  }
}


module.exports = { getMapaOfIndicador, createMapa, updateMapa };