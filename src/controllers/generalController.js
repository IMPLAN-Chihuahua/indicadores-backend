const generalServices = require('../services/generalServices');

const getInformation = async (req, res, next) => {
    const page = req.matchedData.page || 1;
    const perPage = req.matchedData.perPage || 15;
    const attributes = req.matchedData.attributes || {};
    const id = req.matchedData.id || null;
    const where = id === null ? {} : { id };
    const { sortBy, order } = req.matchedData;
    const { model } = req;

    try {
        const { information, total } = await generalServices.getInformation(page, perPage, attributes, where, sortBy, order, model);
        const totalPages = Math.ceil(total / perPage);

        return res.status(200).json({
            page,
            perPage,
            totalPages,
            total,
            data: information
        });

    } catch (err) {
        next(err)
    }
}

module.exports = {
    getInformation
};
