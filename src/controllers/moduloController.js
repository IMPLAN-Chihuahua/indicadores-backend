const { Modulo, Indicador, Sequelize } = require('../models');
const { addModulo, isTemaIndicadorAlreadyInUse, updateModulo, retrieveModulos } = require('../services/moduloService');

const getModulos = async (req, res) => {
    try {
        const test = await retrieveModulos();
        return res.status(200).json({ data: modulos });
    } catch (err) {
        return res.sendStatus(500);
    }
};

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
        if (await isTemaIndicadorAlreadyInUse(temaIndicador)) {
            return res.status(400).json({
                message: `El tema indicador ${temaIndicador} ya está en uso`,
            });
        }
        const savedModulo = await addModulo({
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
        const updatedModulo = await updateModulo(idModulo, fields);
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

module.exports = { getModulos, createModulo, editModulo }