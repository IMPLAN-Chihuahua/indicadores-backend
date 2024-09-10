const models = require('../models');
const {
    IndicadorObjetivo,
} = models;

const updateIndicadorObjetivos = async (indicadorId, objetivos) => {
    try {
        const objetivosOnIndicador = await IndicadorObjetivo.findAll({
            where: {
                idIndicador: indicadorId,
            },
            attributes: ['idObjetivo']
        });


        const existingObjetivosId = objetivosOnIndicador.map(objetivo => objetivo.idObjetivo);
        console.log('objetivos from database')
        console.log('objetivos from database')
        console.log('objetivos from database')
        console.log('objetivos from database')
        console.log('objetivos from database')
        console.log(existingObjetivosId);

        console.log('objetivos from client')
        console.log('objetivos from client')
        console.log('objetivos from client')
        console.log('objetivos from client')
        console.log('objetivos from client')
        console.log(objetivos);

        const objetivosToAdd = objetivos.filter(objetivo => !existingObjetivosId.includes(objetivo));

        console.log('objetivos to add')
        console.log('objetivos to add')
        console.log('objetivos to add')
        console.log('objetivos to add')
        console.log('objetivos to add')
        console.log(objetivosToAdd);

        const objetivosToDelete = existingObjetivosId.filter(objetivo => !objetivos.includes(objetivo));

        console.log('objetivos to delete')
        console.log('objetivos to delete')
        console.log('objetivos to delete')
        console.log('objetivos to delete')
        console.log('objetivos to delete')
        console.log(objetivosToDelete);

        if (objetivosToAdd.length > 0) {
            await IndicadorObjetivo.bulkCreate(objetivosToAdd.map(objetivo => ({
                idIndicador: indicadorId,
                idObjetivo: objetivo
            })));
        }

        if (objetivosToDelete.length > 0) {
            await IndicadorObjetivo.destroy({
                where: {
                    idIndicador: indicadorId,
                    idObjetivo: objetivosToDelete
                }
            });
        }

        return true;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    updateIndicadorObjetivos
}