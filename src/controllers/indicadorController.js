const stream = require('stream');
const IndicadorService = require("../services/indicadorService")
const { generateCSV, generateXLSX, generatePDF } = require("../services/fileService");
const UsuarioService = require('../services/usuariosService');
const { getPagination } = require('../utils/pagination');
const { FILE_PATH, FRONT_PATH } = require('../middlewares/determinePathway');
const { getImagePathLocation } = require('../utils/stringFormat');
const { countIndicadoresByDimension } = require('./dimensionController');


const getIndicador = async (req, res, next) => {
  const { pathway } = req;
  const { idIndicador, format } = req.matchedData;
  try {
    const indicador = await IndicadorService.getIndicador(idIndicador, pathway);
    // TODO: validate if temas related to indicador are not active
    if (!indicador.activo && pathway !== FRONT_PATH) {
      return res.status(409).json({ status: 409, message: `El indicador ${indicador.nombre} se encuentra inactivo` });
    }

    if (pathway === FILE_PATH) {
      return generateFile(format, res, indicador).catch(err => next(err));
    }

    return (res.status(200).json({ data: indicador, navigation: { prev: indicador.prev, next: indicador.next } }));

  } catch (err) {
    next(err)
  }
}

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

// TODO: fix pagination when filters are applied
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


const getIndicadoresOfObjetivo = async (req, res, next) => {
  const { page, perPage, searchQuery, ...filters } = req.matchedData;
  let indicadores = []
  let destacados = []
  let total = 0;
  let offset = (page - 1) * perPage;

  const destacadosCount = await IndicadorService.countIndicadores({ searchQuery, destacado: true, ...filters })

  if (page === 1) {
    destacados = await IndicadorService.findAllIndicadores({
      destacado: true,
      perPage: IndicadorService.LIMIT_NUMBER_INDICADORES_PER_DIMENSION,
      searchQuery,
      offset: 0,
      ...filters
    });
  }

  if (page > 1) {
    offset -= destacadosCount;
  }

  const noDestacados = await IndicadorService.findAllIndicadores({
    destacado: false,
    offset,
    perPage: page === 1 ? perPage - destacadosCount : perPage,
    searchQuery,
    ...filters,
  });

  indicadores = [...destacados, ...noDestacados]
  const indicadoresCount = await IndicadorService.countIndicadores({ searchQuery, destacado: false, ...filters })
  total = indicadoresCount + destacadosCount;

  return res.status(200).json({
    data: indicadores,
    total: total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage)
  })
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
  const indicador = req.matchedData;
  indicador.createdBy = req.sub;
  indicador.updatedBy = req.sub;
  indicador.owner = req.sub;
  indicador.mapa = { ...indicador?.mapa, ...image };
  const savedIndicador = await IndicadorService.createIndicador(indicador);
  return res.status(201).json({ data: savedIndicador });

};

const updateIndicador = async (req, res, next) => {
  const { idIndicador, ...indicador } = req.matchedData;
  indicador.updatedBy = req.sub;

  await IndicadorService.updateIndicador(idIndicador, indicador);

  return res.sendStatus(204);
};

const updateIndicadorStatus = async (req, res, next) => {
  const { idIndicador } = req.matchedData;
  await IndicadorService.updateIndicadorStatus(idIndicador);
  return res.sendStatus(204);
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

const getRandomIndicador = async (req, res, next) => {
  const { idTema } = req.params;
  try {
    const indicador = await IndicadorService.getRandomIndicador(idTema);
    return res.status(200).json({ data: indicador });
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
  getUsersFromIndicador,
  getIndicadoresOfObjetivo,
  getRandomIndicador,
}
