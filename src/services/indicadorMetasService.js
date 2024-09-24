const models = require('../models');
const {
    IndicadorMetas,
} = models;

const updateIndicadorMetas = async (indicadorId, metas) => {
    try {
        const metasOnIndicador = await IndicadorMetas.findAll({
            where: {
                idIndicador: indicadorId,
            },
            attributes: ['idMeta']
        });

        const existingMetasId = metasOnIndicador.map(meta => meta.idMeta);

        const metasToAdd = metas.filter(meta => !existingMetasId.includes(meta));

        metasToDelete = existingMetasId.filter(meta => !metas.includes(meta));

        if (metasToAdd.length > 0) {
            await IndicadorMetas.bulkCreate(metasToAdd.map(meta => ({
                idIndicador: indicadorId,
                idMeta: meta
            })));
        }

        if (metasToDelete.length > 0) {
            await IndicadorMetas.destroy({
                where: {
                    idIndicador: indicadorId,
                    idMeta: metasToDelete
                }
            });
        }

        return true;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    updateIndicadorMetas
}