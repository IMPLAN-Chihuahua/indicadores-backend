const { Indicador } = require('../models');

const getIndicadores = async () => {
    return await Indicador.findAndCountAll();
};

const getIndicador = async (idIndicador) => {
    return await Indicador.findOne({
        where: {
            id: idIndicador
        }
    });
}

module.exports = { getIndicadores, getIndicador };