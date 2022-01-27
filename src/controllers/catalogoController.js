const { Ods, CoberturaGeografica, UnidadMedida } = require('../models');

const getOds = async (_, res) => {
    const Promises = [
        new Promise((resolve, reject) => {
            const coberturasList = CoberturaGeografica.findAll();
            if (coberturasList === null) {
                reject('Error al obtener las coberturas');
                return;
            }
            resolve(coberturasList);
        }),
        new Promise((resolve, reject) => {
            const odsList = Ods.findAll();
            if (odsList === null) {
                reject('Error al obtener las coberturas');
                return;
            }
            resolve(odsList);
        }),
        new Promise((resolve, reject) => {
            const unidades = UnidadMedida.findAll();
            if (unidades === null) {
                reject('Error al obtener las coberturas');
                return;
            }
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
                console.log(err + 'ERROR');
                return res.status(500);
            })
    );


};



module.exports = { getOds };
