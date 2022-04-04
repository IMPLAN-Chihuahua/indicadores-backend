const catalogosService = require('../services/catalogosService');
const { CatalogoDetail } = require('../models');

/** PUBLIC WEBSITE QUESTION  */

const getCatalogos = async (_, res) => {
	const Promises = [
		new Promise((resolve) => {
			const coberturasList = CatalogoDetail.findAll({ where: { idCatalogo: 1 } });
			resolve(coberturasList);
		}),
		new Promise((resolve) => {
			const odsList = CatalogoDetail.findAll({ where: { idCatalogo: 2 } });
			resolve(odsList);
		}),
		new Promise((resolve) => {
			const unidades = CatalogoDetail.findAll({ where: { idCatalogo: 3 } });
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
		if (ods === null) {
			return res.status(404).json({ message: 'Ods not found' });
		}

		return res.status(200).json({ data: ods });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const createOds = async (req, res) => {
	const { nombre } = req.body;
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

// Cobertura geográfica
const getCoberturas = async (req, res) => {
	try {
		const coberturasList = await catalogosService.getCoberturas();
		return res.status(200).json({ data: coberturasList });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const getCoberturaById = async (req, res) => {
	const coberturaID = req.matchedData.idCobertura;
	try {
		const cobertura = await catalogosService.getCoberturaById(coberturaID);
		if (cobertura === null) {
			return res.status(404).json({ message: 'Cobertura not found' });
		}
		return res.status(200).json({ data: cobertura });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const createCobertura = async (req, res) => {
	const { nombre } = req.body;
	const nombreExists = await catalogosService.getCoberturaByName(nombre);
	try {
		if (nombreExists) {
			return res.status(409).json({ message: 'Cobertura already exists' });
		}
		const cobertura = await catalogosService.createCobertura(nombre);
		return res.status(201).json({ data: cobertura });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const updateCobertura = async (req, res) => {
	const id = req.params.idCobertura;
	const { nombre } = req.body;
	const nombreExists = await catalogosService.getCoberturaByName(nombre);
	try {
		if (nombreExists) {
			return res.status(409).json({ message: 'Cobertura already exists' });
		}
		const cobertura = await catalogosService.updateCobertura(id, nombre);
		return res.status(200).json({ cobertura });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const deleteCobertura = async (req, res) => {
	const id = req.params.idCobertura;
	const coberturaExists = await catalogosService.getCoberturaById(id);
	try {
		if (!coberturaExists) {
			return res.status(404).json({ message: 'Cobertura not found' });
		}
		const cobertura = await catalogosService.deleteCobertura(id);
		return res.status(200).json({ cobertura });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

// Unidades Medida
const getUnidades = async (req, res) => {
	try {
		const unidadesList = await catalogosService.getUnidades();
		return res.status(200).json({ data: unidadesList });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const getUnidadById = async (req, res) => {
	const unidadID = req.matchedData.idUnidadMedida;
	try {
		const unidad = await catalogosService.getUnidadMedidaById(unidadID);
		if (unidad === null) {
			return res.status(404).json({ message: 'Unidad not found' });
		}
		return res.status(200).json({ data: unidad });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const createUnidad = async (req, res) => {
	const { nombre } = req.body;
	const nombreExists = await catalogosService.getUnidadMedidaByName(nombre);
	try {
		if (nombreExists) {
			return res.status(409).json({ message: 'Unidad already exists' });
		}
		const unidad = await catalogosService.createUnidadMedida(nombre);
		return res.status(201).json({ data: unidad });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const updateUnidad = async (req, res) => {
	const id = req.params.idUnidadMedida;
	const { nombre } = req.body;
	const nombreExists = await catalogosService.getUnidadMedidaByName(nombre);
	try {
		if (nombreExists) {
			return res.status(409).json({ message: 'Unidad already exists' });
		}
		const unidad = await catalogosService.updateUnidadMedida(id, nombre);
		return res.status(200).json({ unidad });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const deleteUnidad = async (req, res) => {
	const id = req.params.idUnidadMedida;
	const unidadExists = await catalogosService.getUnidadMedidaById(id);
	try {
		if (!unidadExists) {
			return res.status(404).json({ message: 'Unidad not found' });
		}
		const unidad = await catalogosService.deleteUnidadMedida(id);
		return res.status(200).json({ unidad });
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
	getCoberturas,
	getCoberturaById,
	createCobertura,
	updateCobertura,
	deleteCobertura,
	getUnidades,
	getUnidadById,
	createUnidad,
	updateUnidad,
	deleteUnidad
};
