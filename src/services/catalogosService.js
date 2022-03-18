const {
    CatalogoDetail,
} = require('../models');

/** RETRIEVE  */
// Plural
const getOds = async () => {
    const result = await CatalogoDetail.findAndCountAll({
        where: { idCatalogo: 1 }
    });
    return {
        ods: result.rows,
        total: result.count
    };
};

const getUnidades = async () => {
    const result = await CatalogoDetail.findAndCountAll({
        where: { idCatalogo: 2 }
    });
    return {
        unidades: result.rows,
        total: result.count
    };
};

const getCoberturas = async () => {
    const result = await CatalogoDetail.findAndCountAll({
        where: { idCatalogo: 3 }
    });
    return {
        coberturas: result.rows,
        total: result.count
    };
};

// Singular
const getOdsById = async (id) => {
    try {
        const result = await CatalogoDetail.findOne({
            where: { id }
        });
        return result;
    } catch (err) {
        throw new Error(`Error al obtener Ods: ${err.message}`);
    }
};


const getOdsByName = async (name) => {
    try {
        const result = await CatalogoDetail.findOne({
            where: { nombre: name }
        });
        return result;
    } catch (err) {
        throw new Error(`Error al obtener Ods: ${err.message}`);
    }
};

const getUnidadMedidaById = async (id) => {
    try {
        const result = await CatalogoDetail.findOne({
            where: { id }
        });
        return result;
    } catch (err) {
        throw new Error(`Error al obtener Unidad de Medida: ${err.message}`);
    }
};

const getUnidadMedidaByName = async (name) => {
    try {
        const result = await CatalogoDetail.findOne({
            where: { nombre: name }
        });
        return result;
    } catch (err) {
        throw new Error(`Error al obtener Unidad de Medida: ${err.message}`);
    }
};

const getCoberturaById = async (id) => {
    try {
        const result = await CatalogoDetail.findOne({
            where: { id }
        });
        return result;
    } catch (err) {
        throw new Error(`Error al obtener Cobertura Geográfica: ${err.message}`);
    }
};

const getCoberturaByName = async (name) => {
    try {
        const result = await CatalogoDetail.findOne({
            where: { nombre: name }
        });
        return result;
    } catch (err) {
        throw new Error(`Error al obtener Cobertura Geográfica: ${err.message}`);
    }
};

/** WRITE  */
const createOds = async (data) => {
    try {
        const result = await CatalogoDetail.create({ nombre: data });
        return result;
    } catch (err) {
        throw new Error(`Error al crear Ods: ${err.message}`);
    }
};

const createUnidadMedida = async (data) => {
    try {
        const result = await CatalogoDetail.create({ nombre: data });
        return result;
    } catch (err) {
        throw new Error(`Error al crear Unidad Medida: ${err.message}`);
    }
};

const createCobertura = async (data) => {
    try {
        const result = await CatalogoDetail.create({ nombre: data });
        return result;
    } catch (err) {
        throw new Error(`Error al crear Cobertura: ${err.message}`);
    }
};

/** UPDATE   */
const updateOds = async (id, data) => {
    try {
        const result = await CatalogoDetail.update({ nombre: data, idCatalogo: 1 },
            {
                where: { id }
            });
        return result > 0;
    } catch (err) {
        throw new Error(`Error al actualizar Ods: ${err.message}`);
    }
};

const updateUnidadMedida = async (id, data) => {
    try {
        const result = await CatalogoDetail.update({...data, idCatalogo: 1},
            {
                where: { id }
            });
        return result > 0;
    } catch (err) {
        throw new Error(`Error al actualizar Unidad Medida: ${err.message}`);
    }
};

const updateCobertura = async (id, data) => {
    try {
        const result = await CatalogoDetail.update(data,
            {
                where: { id }
            });
        return result > 0;
    } catch (err) {
        throw new Error(`Error al actualizar Cobertura: ${err.message}`);
    }
};

/** DELETE  */
const deleteOds = async (id) => {
    try {
        const result = await CatalogoDetail.destroy({
            where: { id }
        });
        return result > 0;
    } catch (err) {
        throw new Error(`Error al eliminar Ods: ${err.message}`);
    }
};

const deleteUnidadMedida = async (id) => {
    try {
        const result = await CatalogoDetail.destroy({
            where: { id }
        });
        return result > 0;
    } catch (err) {
        throw new Error(`Error al eliminar Unidad Medida: ${err.message}`);
    }
};

const deleteCobertura = async (id) => {
    try {
        const result = await CatalogoDetail.destroy({
            where: { id }
        });
        return result > 0;
    } catch (err) {
        throw new Error(`Error al eliminar Cobertura: ${err.message}`);
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