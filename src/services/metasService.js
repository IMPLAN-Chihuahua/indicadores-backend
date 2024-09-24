const models = require('../models');
const {
    MetasIndicadores,
} = models;

const updateIndicadorTemas = async (indicadorId, temas) => {
    try {
        const temasOnIndicador = await IndicadorTema.findAll({
            where: {
                idIndicador: indicadorId,
            },
            attributes: ['idTema']
        });

        const existingTemasId = temasOnIndicador.map(tema => tema.idTema);

        const temasToAdd = temas.filter(tema => !existingTemasId.includes(tema));

        const temasToDelete = existingTemasId.filter(tema => !temas.includes(tema));

        if (temasToAdd.length > 0) {
            await IndicadorTema.bulkCreate(temasToAdd.map(tema => ({
                idIndicador: indicadorId,
                idTema: tema
            })));
        }

        if (temasToDelete.length > 0) {
            await IndicadorTema.destroy({
                where: {
                    idIndicador: indicadorId,
                    idTema: temasToDelete
                }
            });
        }

        return true;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    updateIndicadorTemas
}