const stream = require('stream');
const IndicadorService = require("../services/indicadorService")
const { generateCSV, generateXLSX, generatePDF } = require("../services/fileService");
const UsuarioService = require('../services/usuariosService');
const { areConnected, createRelation } = require("../services/usuarioIndicadorService");
const { getPagination } = require('../utils/pagination');
const { FILE_PATH } = require('../middlewares/determinePathway')
const os = require('os')

const getIndicador = async (req, res, next) => {
  const { pathway } = req;
  const { idIndicador, format } = req.matchedData;
  try {
    const indicador = await IndicadorService.getIndicador(idIndicador, pathway);
    if (indicador === null) {
      return res.status(404).json({ status: 404, message: `Indicador with id ${idIndicador} not found` });
    }
    if (pathway === FILE_PATH) {
      return generateFile(format, res, indicador).catch(err => next(err));
    }
    return (res.status(200).json({ data: indicador }))
  } catch (err) {
    next(err)
  }
};

const generateFile = async (format, res, indicador) => {
  const filename = `${indicador.nombre}.${format}`
  res.header('Content-disposition', 'attachment');
  switch (format) {
    case 'json':
      return (
        res.header('Content-Type', 'application/json'),
        res.attachment(filename),
        res.send(indicador));
    case 'csv':
      const csvData = generateCSV(indicador);
      return (
        res.header('Content-Type', 'application/csv'),
        res.attachment(filename),
        res.send(csvData));
    case 'xlsx':
      const content = await generateXLSX(indicador);
      const readStream = new stream.PassThrough();
      readStream.end(content);
      return (
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        res.attachment(filename),
        readStream.pipe(res)
      );
    case 'pdf':
      const doc = await generatePDF(indicador);
      return (
        res.header('Content-Type', 'application/pdf'),
        res.attachment(filename),
        res.send(doc));
    default:
      throw new Error('Invalid file format');
  }
}

const getIndicadores = async (req, res, next) => {
  const { pathway } = req;
  const { page, perPage } = getPagination(req.matchedData);
  try {
    const { indicadores, total } = await IndicadorService.getIndicadores(page, perPage, req.matchedData, pathway);
    const totalPages = Math.ceil(total / perPage);
    return res.status(200).json({ page, perPage, total, totalPages, data: indicadores });
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
  let urlImagen = '';
  if (process.env.NODE_ENV === 'production') {
    urlImagen = req.file.location;
  } else if (req.file) {
    urlImagen = `http://${req.headers.host}/${req.file.path}`;
  }
  try {
    const indicador = req.matchedData;
    indicador.createdBy = req.sub;
    indicador.updatedBy = req.sub;
    if (urlImagen) {
      indicador.mapa.urlImagen = urlImagen;
    }
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

const setUsuariosToIndicador = async (req, res, next) => {
  const { idIndicador, usuarios, desde, hasta } = req.matchedData;
  const updatedBy = req.sub;
  const createdBy = req.sub;

  try {
    await createRelation(
      [...usuarios],
      [idIndicador],
      {
        fechaDesde: desde,
        fechaHasta: hasta,
        updatedBy,
        createdBy
      }
    )
    return res.sendStatus(201);
  } catch (err) {
    next(err)
  }
}

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
  setUsuariosToIndicador,
  getUsersFromIndicador
};
