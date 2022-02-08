const { Modulo, Indicador, Sequelize } = require('../models');

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

module.exports = { getModulos }