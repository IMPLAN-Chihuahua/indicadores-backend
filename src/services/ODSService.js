const models = require('../models');
const {
    ODS,
    Metas
} = models;

const getMultipleODS = async () => {
    try {
        return await ODS.findAll();
    } catch (err) {
        throw err;
    }
};

const getMetas = async (idOds) => {

    try {
        const metas = await Metas.findAndCountAll({
            where: {
                idOds
            }
        });

        return metas;
    } catch (err) {
        throw err;
    }
};


module.exports = {
    getMultipleODS,
    getMetas
}