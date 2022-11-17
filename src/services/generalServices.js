const Models = require('../models');

const getInformation = async (model, options) => {
    const Model = model.charAt(0).toUpperCase() + model.slice(1);
    console.log(options);
    try {
        const result = await Models[Model].findAndCountAll({
            ...options
        });
        return {
            information: result.rows,
            total: result.count
        }
    } catch (err) {
        throw new Error(`Error al obtener ${model}: ${err.message}`);
    }
}

module.exports = {
    getInformation
}