const Models = require('../models');

const getInformation = async (page, perPage, attributes, where, sortBy, order, model) => {
    const Model = model.charAt(0).toUpperCase() + model.slice(1);
    try {
        const result = await Models[Model].findAndCountAll({
            limit: perPage,
            offset: (page - 1) * perPage,
            ...(attributes.length > 0 && { attributes }),
            where: where,
            order: getSorting({ sortBy, order })
        });
        return {
            information: result.rows,
            total: result.count
        }
    } catch (err) {
        throw new Error(`Error al obtener ${model}: ${err.message}`);
    }
}

const getSorting = ({ sortBy, order }) => {
    const arrangement = [];
    arrangement.push([sortBy || "id", order || "ASC"]);
    return arrangement;
};

module.exports = {
    getInformation
}