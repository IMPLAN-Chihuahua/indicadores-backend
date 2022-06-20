const stream = require('stream');
const IndicadorService = require("../services/indicadorService")
const { generateCSV, generateXLSX, generatePDF } = require("../services/generadorArchivosService");
const UsuarioService = require('../services/usuariosService');
const { areConnected, createRelation } = require("../services/usuarioIndicadorService");
const { getPagination } = require('../utils/pagination');

const getIndicador = async (req, res) => {
  const { pathway } = req;
  const { idIndicador, format } = req.matchedData;
  try {
    const indicador = await IndicadorService.getIndicador(idIndicador, pathway);
    if (indicador === null) {
      return res.status(404).send(`Indicador con id ${idIndicador} no encontrado`);
    }

    if (typeof format !== 'undefined') {
      return generateFile(format, res, indicador)
    }

    return (res.status(200).json({ data: indicador }))
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const generateFile = async (format, res, data) => {
  switch (format) {
    case 'json':
      return (
        res.header('Content-disposition', 'attachment'),
        res.header('Content-Type', 'application/json'),
        res.attachment(`${data.nombre}.json`),
        res.send(data));
    case 'csv':
      const csvData = generateCSV(data);
      return (
        res.header('Content-disposition', 'attachment'),
        res.header('Content-Type', 'application/csv'),
        res.attachment(`${data.nombre}.csv`),
        res.send(csvData));
    case 'xlsx':
      const content = await generateXLSX(data);
      const readStream = new stream.PassThrough();
      readStream.end(content);
      return (
        res.header('Content-disposition', 'attachment'),
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        readStream.pipe(res)
      );
    case 'pdf':
      const doc = await generatePDF(data);
      return (
        res.header('Content-disposition', 'attachment'),
        res.header('Content-Type', 'application/pdf'),
        res.send(doc));
  }
}

const getIndicadores = async (req, res) => {
  const { pathway } = req;
  const { page, perPage, order } = getPagination(req.matchedData);
  try {
    const { indicadores, total } = await IndicadorService.getIndicadores(page, perPage, req.matchedData, pathway);
    const totalPages = Math.ceil(total / perPage);
    return res.status(200).json({ page, perPage, total, totalPages, data: indicadores });
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

const getIndicadoresFromUser = async (req, res) => {
  try {
    const idUsuario = req.sub;
    const { indicadores, total } = await UsuarioService.getIndicadoresFromUser(idUsuario);
    return res.status(200).json({
      total,
      data: indicadores,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const createIndicador = async (req, res) => {
  try {
    const indicador = req.matchedData;
    indicador.createdBy = req.sub;
    indicador.updatedBy = req.sub;
    const savedIndicador = await IndicadorService.createIndicador(indicador);
    return res.status(201).json({ data: savedIndicador });
  } catch (err) {
    console.log(err)
    return res.status(500).send(err.message);
  }
};

const updateIndicador = async (req, res) => {
  try {
    let urlImagen = '';
    const { idIndicador, ...indicador } = req.matchedData;
    const idUsuario = req.sub;
    const rol = req.rol || await UsuarioService.getRol(idUsuario);

    urlImagen = req.file ? `/images/indicador/${req.file.filename}` : urlImagen;

    let fields = {};
    if (urlImagen) {
      fields = { ...indicador, urlImagen };
      console.log('tiene imagen');
    }
    else {
      fields = { ...indicador };
      console.log('no tiene imagen');
    }

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
    console.log(err)
    return res.status(500).send(err.message)
  }
};

const updateIndicadorStatus = async (req, res) => {
  const { idIndicador } = req.matchedData;

  try {
    const updatedIndicador = await IndicadorService.updateIndicadorStatus(idIndicador);
    if (updatedIndicador) {
      return res.sendStatus(204);
    }
    return res.sendStatus(400);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const setUsuariosToIndicador = async (req, res) => {
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
    console.log(err, err.message)
    return res.status(500).send(err.message);
  }
}

module.exports = {
  getIndicadores,
  getIndicador,
  getIndicadoresFromUser,
  createIndicador,
  updateIndicador,
  updateIndicadorStatus,
  setUsuariosToIndicador
};
