const { Modulo, sequelize, Sequelize } = require('../models');

const addModulo = async (modulo) => {
    try {
        const {
            temaIndicador,
            observaciones,
            activo,
            codigo,
            urlImagen,
            color,
        } = await Modulo.create(modulo);
        return {
            temaIndicador,
            observaciones,
            activo,
            codigo,
            urlImagen,
            color,
        }
    
    } catch(err) {
        return Promise.reject(new Error(`Error al crear modulo ${err.message}`));
    }
};

const updateModulo = async (id, {temaIndicador, observaciones, activo, codigo, urlImagen, color}) => {
    try {
        const affectedRows = await Modulo.update(
            {temaIndicador, observaciones, activo, codigo, urlImagen, color},
            {where: {id: id}}
        );
        return affectedRows > 0;
    } catch(err) {
        throw new Error(`Error al actualizar modulo ${err.message}`);
    }
};
 
const isTemaIndicadorAlreadyInUse = async (temaIndicador) => {
    try {
        const existingTema = await Modulo.findOne({
            attributes: ['temaIndicador'],
            where: {temaIndicador: temaIndicador}
        });
        return existingTema != null;
    } catch(err) {
        throw new Error(`Error al buscar tema indicador ${err.message}`);
    }
}



module.exports = {
    addModulo,
    isTemaIndicadorAlreadyInUse,
    updateModulo,
}