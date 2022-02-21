const { Modulo, Indicador, Sequelize } = require('../models');
const faker = require('faker');
const {addModulo, isTemaIndicadorAlreadyInUse} = require('../services/moduloService');

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


module.exports = { getModulos, createModulo }