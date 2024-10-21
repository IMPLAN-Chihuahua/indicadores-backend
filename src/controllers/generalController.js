const generalServices = require('../services/generalServices');

const getInformation = async (req, res, next) => {
    const { page = 1, perPage = 15, attributes = [], id = null, sortBy, order } = req.matchedData;
    const { model } = req;
    const where = id === null ? {} : { id };

    try {
        const { information, total } = await generalServices.getInformation(page, perPage, attributes, where, sortBy, order, model);

        return res.status(200).json({
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
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
