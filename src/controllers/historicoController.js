const HistoricoService = require('../services/historicoService');
const IndicadorService = require('../services/indicadorService')
const { getPaginationHistoricos } = require('../utils/pagination');
const { Historico } = require('../models');
const { validate } = require('../services/authService');


const getHistoricos = async (req, res, next) => {
  const { idIndicador, order, sortBy } = req.matchedData;
  const { page, perPage } = getPaginationHistoricos(req.matchedData);
  try {
    const { ultimoValorDisponible, updatedAt, periodicidad } = await IndicadorService.getIndicador(idIndicador, 'front'); const { historicos, total } = await HistoricoService.getHistoricos(idIndicador, page, perPage, order, sortBy);
    if (historicos.length > 0) {
      const totalPages = Math.ceil(total / perPage);
      return res.status(200).json({ idIndicador: idIndicador, indicadorLastValue: ultimoValorDisponible, indicadorLastUpdateDate: updatedAt, indicadorPeriodicidad: periodicidad, page: page, perPage: perPage, total: total, totalPages: totalPages, data: historicos });
    } else if (historicos.length === 0) {
      return res.status(200).json({ idIndicador: idIndicador, indicadorLastValue: ultimoValorDisponible, indicadorLastUpdateDate: updatedAt, indicadorPeriodicidad: periodicidad, page: page, perPage: perPage, total: total, totalPages: 0, data: [] });
    } else {
      return res.sendStatus(400);
    }

  } catch (err) {
    next(err)
  }
};


const deleteHistorico = async (req, res, next) => {
  const { idHistorico } = req.matchedData;
  const idUsuario = req.sub;
  const rol = req.rol;
  try {
    const idIndicador = await IndicadorService.getIdIndicadorRelatedTo(Historico, idHistorico)
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const deleted = await HistoricoService.deleteHistorico(idHistorico);
        return deleted ? res.status(200).json({ message: 'Historico eliminado' }) : res.sendStatus(400);
      },
      () => res.status(403).send('No tienes permiso para eliminar este histórico')
    )
  } catch (err) {
    next(err)
  }
};


const updateHistorico = async (req, res, next) => {
  const { idHistorico, ...values } = req.matchedData;
  const idUsuario = req.sub;
  const rol = req.rol;
  try {
    const idIndicador = await IndicadorService.getIdIndicadorRelatedTo(Historico, idHistorico)
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const response = await HistoricoService.updateHistorico(idHistorico, values);
        return response ? res.sendStatus(204) : res.sendStatus(400);
      },
      () => res.status(403).send('No tienes permiso para actualizar este histórico')
    )
  } catch (err) {
    next(err)
  };
};


const createHistorico = async (req, res, next) => {
  const { idIndicador, ...historico } = req.matchedData;
  const idUsuario = req.sub;
  const rol = req.rol;
  try {
    return validate(
      { rol, idUsuario, idIndicador },
      async () => {
        const response = await HistoricoService.createHistorico(idIndicador, historico);
        return res.status(201).json(response);
      },
      () => res.status(403).send('No tienes permiso para agregar un histórico a este indicador')
    );
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getHistoricos,
  deleteHistorico,
  updateHistorico,
  createHistorico,
}