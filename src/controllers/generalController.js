const generalServices = require('../services/generalServices');

const getInformation = async (req, res, next) => {
    const { model } = req;
    const { options } = req.matchedData;
    try {
        const { information, total } = await generalServices.getInformation(model, options);
        return res.status(200).json({ total, data: information });
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getInformation
};
