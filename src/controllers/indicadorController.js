const stream = require('stream');
const IndicadorService = require("../services/indicadorService")
const { generateCSV, generateXLSX, generatePDF } = require("../services/fileService");
const UsuarioService = require('../services/usuariosService');
const { areConnected } = require("../services/usuarioIndicadorService");
const { getPagination } = require('../utils/pagination');
const { FILE_PATH, FRONT_PATH } = require('../middlewares/determinePathway');
const { getImagePathLocation } = require('../utils/stringFormat');


const getIndicador = async (req, res, next) => {
  const { pathway } = req;
  const { idIndicador, format } = req.matchedData;
  try {
    const indicador = await IndicadorService.getIndicador(idIndicador, pathway);
    const hasConflict = indicador.activo === 'NO' || indicador?.modulo.activo === 'NO';
    if (hasConflict && pathway !== FRONT_PATH) {
      return res.status(409).json({ status: 409, message: `El indicador ${indicador.nombre} se encuentra inactivo` });
    }
    if (pathway === FILE_PATH) {
      return generateFile(format, res, indicador).catch(err => next(err));
    }
    return (res.status(200).json({ data: indicador, navigation: { prev: indicador.prev, next: indicador.next } }));
  } catch (err) {
    next(err)
  }
};

const generateFile = async (format, res, indicador) => {
  const filename = `${indicador.nombre}.${format}`
  res.header('Content-disposition', 'attachment');
  res.attachment(filename)
  switch (format) {
    case 'json':
      return (
        res.header('Content-Type', 'application/json'),
        res.send(indicador)
      );
    case 'csv':
      const csvData = generateCSV(indicador);
      return (
        res.header('Content-Type', 'application/csv'),
        res.send(csvData)
      );
    case 'xlsx':
      const content = await generateXLSX(indicador);
      const readStream = new stream.PassThrough();
      readStream.end(content);
      return (
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        readStream.pipe(res)
      );
    case 'pdf':
      const doc = await generatePDF(indicador);
      return (
        res.header('Content-Type', 'application/pdf'),
        res.send(doc)
      );
    default:
      throw new Error('Invalid file format');
  }
}

const getIndicadores = async (req, res, next) => {
  const { pathway } = req;
  const { page, perPage } = getPagination(req.matchedData);
  try {
    const { indicadores, total } = await IndicadorService.getIndicadores(page, perPage, req.matchedData, pathway);
    const { count } = await IndicadorService.getInactiveIndicadores();
    const totalPages = Math.ceil(total / perPage);
    return res.status(200).json({ page, perPage, total, totalInactive: count, totalPages, data: indicadores });
  } catch (err) {
    next(err)
  }
}

const getIndicadoresFromUser = async (req, res, next) => {
  try {
    const idUsuario = req.sub;
    const { indicadores, total } = await UsuarioService.getIndicadoresFromUser(idUsuario);
    return res.status(200).json({
      total,
      data: indicadores,
    });
  } catch (err) {
    next(err)
  }
}

const createIndicador = async (req, res, next) => {
  const image = getImagePathLocation(req);
  try {
    const indicador = req.matchedData;
    indicador.createdBy = req.sub;
    indicador.updatedBy = req.sub;
    indicador.owner = req.sub;
    indicador.mapa = {...indicador?.mapa, ...image};
    const savedIndicador = await IndicadorService.createIndicador(indicador);
    return res.status(201).json({ data: savedIndicador });
  } catch (err) {
    next(err)
  }
};

const updateIndicador = async (req, res, next) => {
  try {
    const { idIndicador, ...indicador } = req.matchedData;
    const idUsuario = req.sub;
    const rol = req.rol || await UsuarioService.getRol(idUsuario);

    fields = { ...indicador };

    let saved;
    if (rol === 'ADMIN') {
      saved = await IndicadorService.updateIndicador(idIndicador, fields);
    } else {
      const isAllowed = await areConnected(idUsuario, idIndicador);
      if (!isAllowed) {
        return res.status(403).send('No tiene permiso para actualizar este indicador');
      }
      saved = await IndicadorService.updateIndicador(idIndicador, indicador);
    }

    if (saved) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400);

  } catch (err) {
    next(err)
  }
};

const updateIndicadorStatus = async (req, res, next) => {
  const { idIndicador } = req.matchedData;
  try {
    const updatedIndicador = await IndicadorService.updateIndicadorStatus(idIndicador);
    if (updatedIndicador) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400);
  } catch (err) {
    next(err)
  }
};


const getUsersFromIndicador = async (req, res, next) => {
  const { idIndicador } = req.params;
  try {
    const usuarios = await UsuarioService.getUsersFromIndicador(idIndicador);
    return res.status(200).json({ data: usuarios });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getIndicadores,
  getIndicador,
  getIndicadoresFromUser,
  createIndicador,
  updateIndicador,
  updateIndicadorStatus,
  getUsersFromIndicador
};
