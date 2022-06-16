const catalogosService = require('../services/catalogosService');

const getCatalogos = async (req, res) => {
	try {
		const { catalogos, total } = await catalogosService.getCatalogos();
		return res.status(200).json({ total, data: catalogos });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

const getCatalogosDetails = async (req, res) => {
	const { idCatalogo } = req.params || {};
	try {
		const { catalogos, total } = await catalogosService.getCatalogosDetails(idCatalogo);
		return res.status(200).json({ total, data: catalogos });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err });
	}
};

const getCatalogosFromIndicador = async (req, res) => {
	try {
		const { idIndicador } = req.matchedData || {};
		const data = await catalogosService.getCatalogosFromIndicador(idIndicador);
		return res.status(200).json({ data });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err });
	}
};

module.exports = {
	getCatalogos,
	getCatalogosDetails,
	getCatalogosFromIndicador,
};
