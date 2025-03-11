const HistoricoService = require('../services/historicoService');
const IndicadorService = require('../services/indicadorService')
const { getPaginationHistoricos } = require('../utils/pagination');
const PublicIndicadorService = require('../services/publicIndicadorService');
const PrivateIndicadorService = require('../services/privateIndicadorService');

const getHistoricos = async (req, res, next) => {
  const { idIndicador, order, sortBy } = req.matchedData;
  const { page, perPage } = getPaginationHistoricos(req.matchedData);
  const attributes = ['id', 'nombre', 'ultimoValorDisponible', 'anioUltimoValorDisponible', 'updatedAt', 'periodicidad']

  const latestIndicador = await PrivateIndicadorService.getIndicadorById(idIndicador, attributes);
  if (!latestIndicador) {
    return res.status(409).json({ message: `No se pudo consultar la información más reciente de este indicador (${idIndicador})` })
  }

  const { historicos, total } = await HistoricoService.getHistoricos(idIndicador, page, perPage, order, sortBy);
  const totalPages = Math.ceil(total / perPage);

  return res.status(200).json({
    page,
    perPage,
    total,
    totalPages,
    latestIndicador,
    data: historicos
  });
};


const deleteHistorico = async (req, res, _next) => {
  const { idHistorico } = req.matchedData;

  await HistoricoService.deleteHistorico(idHistorico);
  return res.status(200).json({ message: 'Historico eliminado' })
};


const updateHistorico = async (req, res, next) => {
  const { idHistorico, ...values } = req.matchedData;

  await HistoricoService.updateHistorico(idHistorico, values);
  return res.sendStatus(204);
};


const createHistorico = async (req, res, next) => {
  const { idIndicador, ...historico } = req.matchedData;
  const idUser = req.sub;
  const response = await HistoricoService.createHistorico(idIndicador, historico, idUser);
  return res.status(201).json(response);
}

module.exports = {
  getHistoricos,
  deleteHistorico,
  updateHistorico,
  createHistorico,
}