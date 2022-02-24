const { Modulo, Indicador, Sequelize } = require('../models');
const moduloService = require('../services/moduloService');
const { getPaginationModulos } = require("../utils/pagination");

const getModulos = async (req, res) => {
    try {
        const modulos = await moduloService.getModulos();
        return res.status(200).json({ data: modulos });
    } catch (err) {
        return res.sendStatus(500);
    }
};

/** Admin section */

const createModulo = async (req, res) => {
    const {
        temaIndicador,
        observaciones,
        activo,
        codigo,
        urlImagen,
        color,
    } = req.body;

    try {
        if (await moduloService.isTemaIndicadorAlreadyInUse(temaIndicador)) {
            return res.status(400).json({
                message: `El tema indicador ${temaIndicador} ya está en uso`,
            });
        }
        const savedModulo = await moduloService.addModulo({
            temaIndicador,
            observaciones,
            activo,
            codigo,
            urlImagen,
            color,
        });
        return res.status(201).json({ data: savedModulo });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const editModulo = async (req, res) => {
    const fields = req.body;
    const { idModulo } = req.matchedData;
    try {
        const updatedModulo = await moduloService.updateModulo(idModulo, fields);
        if (updatedModulo) {
            return res.sendStatus(204);
        } else {
            return res.sendStatus(404);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500).json({ message: err.message });
    }
}

const getAllModulos = async (req, res) => {
    const {page, per_page} = getPaginationModulos(req.matchedData);
    try{
        const {modulos, total} = await moduloService.getAllModulos(page, per_page);
        const total_pages = Math.ceil(total / per_page);

        return res.status(200).json({page: page, per_page: per_page, total: total, total_pages: total_pages, data: modulos });
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports = { getModulos, createModulo, editModulo, getAllModulos }