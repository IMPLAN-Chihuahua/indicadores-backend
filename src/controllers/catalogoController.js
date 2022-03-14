const { Ods, CoberturaGeografica, UnidadMedida } = require('../models');
const catalogosService = require('../services/catalogosService');

/** PUBLIC WEBSITE QUESTION  */

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

/** ADMINISTRATIVE SECTION */
// ODS
const getOds = async (req, res) => {
    try {
        const odsList = await catalogosService.getOds();
        return res.status(200).json({ data: odsList });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

const getOdsById = async (req, res) => {
    const odsID = req.matchedData.idOds;
    try {
        const ods = await catalogosService.getOdsById(odsID);
        if(ods === null) {
            return res.status(404).json({ message: 'Ods not found' });
        }

        return res.status(200).json({ data: ods });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

const createOds = async (req, res) => {
    const nombre  = req.body;
    const nombreExists = await catalogosService.getOdsByName(nombre);
    try {
        if (nombreExists) {
            return res.status(409).json({ message: 'Ods already exists' });
        }
        const ods = await catalogosService.createOds(nombre);
        return res.status(201).json({ data: ods });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

const updateOds = async (req, res) => {
    const id = req.params.idOds;
    const { nombre } = req.body;
    const nombreExists = await catalogosService.getOdsByName(nombre);
    try {
        if (nombreExists) {
            return res.status(409).json({ message: 'Ods already exists' });
        }
        const ods = await catalogosService.updateOds(id, nombre);
        return res.status(200).json({ ods });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

const deleteOds = async (req, res) => {
    const id = req.params.idOds;
    const odsExists = await catalogosService.getOdsById(id);
    try {
        if (!odsExists) {
            return res.status(404).json({ message: 'Ods not found' });
        }
        const ods = await catalogosService.deleteOds(id);
        return res.status(200).json({ ods });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

module.exports = { 
    getCatalogos,
    getOds,
    getOdsById,
    createOds,
    updateOds,
    deleteOds,
};
