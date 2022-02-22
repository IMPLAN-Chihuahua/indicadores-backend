const { Modulo, Indicador, Sequelize } = require('../models');
const faker = require('faker');
const { addModulo, isTemaIndicadorAlreadyInUse, updateModulo} = require('../services/moduloService');

const getModulos = async (req, res) => {
    try {
        const modulos = await Modulo.findAll({
            where: {
                activo: 'SI'
            },
            attributes: [
                'id',
                'temaIndicador',
                'codigo',
                'urlImagen',
                'color',
                [Sequelize.fn('COUNT', Sequelize.col('Indicadors.id')), 'indicadoresCount']
            ],
            include: [{
                model: Indicador, attributes: []
            }],
            group: ['Modulo.id'],
            order: [['id']],
        });
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
            console.log('test');
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
        if(updatedModulo) {
            return res.status(204);
        } else{
            return res.sendStatus(404);
        }
    } catch(err) {
        console.log(err);
        return res.sendStatus(500).json({message: err.message});
    }
}

module.exports = { getModulos, createModulo, editModulo }