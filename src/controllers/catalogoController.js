const { Ods, CoberturaGeografica, UnidadMedida } = require('../models');

const getCatalogos = async (_, res) => {
    const Promises = [
        new Promise((resolve) => {
            const coberturasList = CoberturaGeografica.findAll();
            resolve(coberturasList);
        }),
        new Promise((resolve) => {
            const odsList = Ods.findAll();
            resolve(odsList);
        }),
        new Promise((resolve) => {
            const unidades = UnidadMedida.findAll();
            resolve(unidades);
        }),
    ]

    return (
        Promise
            .all([Promises[0], Promises[1], Promises[2]])
            .then(result => res.status(200).json({ coberturas: result[0], ods: result[1], unidadMedida: result[2] }))
            .catch(err => res.sendStatus(500).json({ error: err }))
    );
};



module.exports = { getCatalogos };
