const {
    Ods,
    CoberturaGeografica,
    UnidadMedida,
    Sequelize
} = require('../models');
const { Op } = Sequelize;

/** RETRIEVE  */
// Plural
const getOds = async () => {
    const result = await Ods.findAndCountAll({});
    return {
        ods: result.rows,
        total: result.count
    };
};

const getUnidades = async () => {
    const result = await UnidadMedida.findAndCountAll({});
    return {
        unidades: result.rows,
        total: result.count
    };
};

const getCoberturas = async () => {
    const result = await CoberturaGeografica.findAndCountAll({});
    return {
        coberturas: result.rows,
        total: result.count
    };
};

// Singular
const getOdsById = async (id) => {
    try {
        const result = await Ods.findOne({
            where: { id: id }
        });
        return result;
    } catch (err) {
        throw new Error('Error al obtener Ods: ' + err.message);
    }
};


const getOdsByName = async (name) => {
    try {
        const result = await Ods.findOne({
            where: { nombre: name }
        });
        return result;
    } catch (err) {
        throw new Error('Error al obtener Ods: ' + err.message);
    }
};

const getUnidadMedidaById = async (id) => {
    try {
        const result = await UnidadMedida.findOne({
            where: { id: id }
        });
        return result;
    } catch (err) {
        throw new Error('Error al obtener Unidad de Medida: ' + err.message);
    }
};

const getUnidadMedidaByName = async (name) => {
    try {
        const result = await UnidadMedida.findOne({
            where: { nombre: name }
        });
        return result;
    } catch (err) {
        throw new Error('Error al obtener Unidad de Medida: ' + err.message);
    }
};

const getCoberturaById = async (id) => {
    try {
        const result = await CoberturaGeografica.findOne({
            where: { id: id }
        });
        return result;
    } catch (err) {
        throw new Error('Error al obtener Cobertura Geográfica: ' + err.message);
    }
};

const getCoberturaByName = async (name) => {
    try {
        const result = await CoberturaGeografica.findOne({
            where: { nombre: name }
        });
        return result;
    } catch (err) {
        throw new Error('Error al obtener Cobertura Geográfica: ' + err.message);
    }
};

/** WRITE  */
const createOds = async (data) => {
    console.log('here');
    console.log(data);
    try {
        const result = await Ods.create({nombre: data});
        return result;
    } catch (err) {
        throw new Error('Error al crear Ods: ' + err.message);
    }
};

const createUnidadMedida = async (data) => {
    try {
        const result = await UnidadMedida.create(data);
        return result;
    } catch (err) {
        throw new Error('Error al crear Unidad Medida: ' + err.message);
    }
};

const createCobertura = async (data) => {
    try {
        const result = await CoberturaGeografica.create(data);
        return result;
    } catch (err) {
        throw new Error('Error al crear Cobertura: ' + err.message);
    }
};

/** UPDATE   */
const updateOds = async (id, data) => {
    try {
        const result = await Ods.update({nombre: data}, 
            { 
                where: { id: id } 
            });
        return result > 0;
    } catch (err) {
        throw new Error('Error al actualizar Ods: ' + err.message);
    }
};

const updateUnidadMedida = async (id, data) => {
    try {
        const result = await UnidadMedida.update(data, 
            { 
                where: { id: id } 
            });
        return result > 0;
    } catch (err) {
        throw new Error('Error al actualizar Unidad Medida: ' + err.message);
    }
};

const updateCobertura = async (id, data) => {
    try {
        const result = await CoberturaGeografica.update(data, 
            { 
                where: { id: id } 
            }); 
        return result > 0;
    } catch (err) {
        throw new Error('Error al actualizar Cobertura: ' + err.message);
    }
};

/** DELETE  */
const deleteOds = async (id) => {
    try {
        const result = await Ods.destroy({
            where: { id: id }
        });
        return result > 0;
    } catch (err) {
        throw new Error('Error al eliminar Ods: ' + err.message);
    }
};

const deleteUnidadMedida = async (id) => {
    try {
        const result = await UnidadMedida.destroy({
            where: { id: id }
        });
        return result > 0;
    } catch (err) {
        throw new Error('Error al eliminar Unidad Medida: ' + err.message);
    }
};

const deleteCobertura = async (id) => {
    try {
        const result = await CoberturaGeografica.destroy({
            where: { id: id }
        });
        return result > 0;
    } catch (err) {
        throw new Error('Error al eliminar Cobertura: ' + err.message);
    }
};

module.exports = {
    getOds,
    getUnidades,
    getCoberturas,
    getOdsById,
    getUnidadMedidaById,
    getCoberturaById,
    getOdsByName,
    getUnidadMedidaByName,
    getCoberturaByName,
    createOds,
    createUnidadMedida,
    createCobertura,
    updateOds,
    updateUnidadMedida,
    updateCobertura,
    deleteOds,
    deleteUnidadMedida,
    deleteCobertura,
}