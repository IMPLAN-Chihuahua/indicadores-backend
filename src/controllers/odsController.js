const odsService = require('../services/ODSService');

const getMetasFromOds = async (req, res, next) => {
    const { idOds } = req.matchedData;

    try {
        const metas = await odsService.getMetas(idOds);

        return res.status(200).json({
            data: metas
        });
    } catch (err) {
        next(err);
    }
}


module.exports = {
    getMetasFromOds
}