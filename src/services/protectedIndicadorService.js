/* eslint-disable no-use-before-define */
const { SITE_PATH, FRONT_PATH, FILE_PATH } = require("../middlewares/determinePathway");
const {
    Indicador,
    Modulo,
    Historico,
    Mapa,
    Formula,
    Variable,
    sequelize,
    Sequelize,
    CatalogoDetail,
    CatalogoDetailIndicador
} = require("../models");

const getIndicador = async (id, attributes) => {
    try {

        const result = await Indicador.findOne({
            where: {
                id,
            },
            attributes,
        });
        return result;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    getIndicador,
}