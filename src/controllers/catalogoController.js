const { Ods, CoberturaGeografica, Fuente } = require('../models');



    
const getOds = async (_, res) => {
    //const getOds = Ods.findAll();

    const Promises = [
        new Promise ( (resolve, reject) => {
            const getCobertura = CoberturaGeografica.findAll();
            if(getCobertura === null){
                reject('Error al obtener las coberturas');
                return;
            }
            resolve(getCobertura);
        }),
        new Promise ( (resolve, reject) => {
            const getOds = Ods.findAll();
            if(getOds === null){
                reject('Error al obtener las coberturas');
                return;
            }
            resolve(getOds);
        }),
    ]


    // const odsPromise = new Promise((resolve, reject) => {
    //     return( Ods.findAll()
    //         ? resolve(getOds)
    //         : reject(new Error('Error al obtener los Ods')));
    // });

    // const coberturaPromise = new Promise((resolve, reject) => {
    //     return (CoberturaGeografica.findAll()
    //         ? resolve(getCoberturas)
    //         : reject(new Error('Error al obtener los Ods')));
    // });

    const results = await Promise.all(Promises.map(p => p.catch(e => e)));
    const validResults = results.filter(result => result !== null);
    const setted = await Promise.allSettled(Promises);
    const validSetted = setted.filter(result => result !== null);
    //console.log(validSetted);
    //console.dir(validResults[0]);

    return (
        Promise 
        .all([Promises[0], Promises[1]])
        .then(result => {
            return res.status(200).json({ods:result[0], coberturas:result[1]});
        })
        .catch(err => {
            console.log(err + 'ERROR');
        })
    );


};



module.exports = { getOds };
