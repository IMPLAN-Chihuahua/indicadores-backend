const { Ods, CoberturaGeografica, UnidadMedida } = require('../models');

const getCatalogos = async (_, res) => {
    const Promises = [
        new Promise((resolve, reject) => {
            const coberturasList = CoberturaGeografica.findAll();
            resolve(coberturasList);
        }),
        new Promise((resolve, reject) => {
            const odsList = Ods.findAll();
            resolve(odsList);s
        }),
        new Promise((resolve, reject) => {
            const unidades = UnidadMedida.findAll();
            resolve(unidades);
        }),
    ]

    return (
        Promise
            .all([Promises[0], Promises[1], Promises[2]])
            .then(result => {
                return res.status(200).json({ coberturas: result[0], ods: result[1], unidadMedida: result[2] });
            })
            .catch(err => {
                return res.sendStatus(500).json({error : err});
            })
    );


};



module.exports = { getCatalogos };
