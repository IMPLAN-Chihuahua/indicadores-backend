const IndicadorService = require("../services/indicadorService")
const { getPagination } = require("../utils/pagination");
const { generateCSV, generateXLSX, generatePDF } = require("../services/generadorArchivosService");
const stream = require('stream');

const getIndicadores = async (req, res) => {
  const { page, per_page } = getPagination(req.matchedData);
  try {
    const { indicadores, total } = await IndicadorService.getIndicadores(page, per_page, req.matchedData);
    const total_pages = Math.ceil(total / per_page);

    return res.status(200).json({
      page,
      per_page,
      total,
      total_pages,
      data: indicadores,
    });
  } catch (err) {
    return res.status(500);
  }
};

const getIndicador = async (req, res) => {
  try {
    const idIndicador = req.matchedData.idIndicador;
    const format = req.matchedData.format;
    const indicador = await IndicadorService.getIndicador(idIndicador, format);
    if (indicador === null) {
      return res.sendStatus(404);
    }

    if (typeof format != 'undefined') {
      return generateFile(format, res, indicador)
    }

    return (res.status(200).json({ data: indicador, }))
  } catch (err) {
    return res.sendStatus(500);
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


/** USER SECTION */

const getIndicadoresFromUser = async (req, res) => {
  try {
    const idUsuario = req.sub;
    const {indicadores, total} = await IndicadorService.getIndicadoresFromUser(idUsuario);
    return res.status(200).json({
      cantidadIndicadores: total,
      data: indicadores,
    })

  } catch (err) {
    return res.status(500);
  }
}

module.exports = {
  getIndicadores,
  getIndicador,
  getIndicadoresFromUser,
};
