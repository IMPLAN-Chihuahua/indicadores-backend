const catalogosService = require('../services/catalogosService');

const getCatalogos = async (req, res, next) => {
	try {
		const { catalogos, total } = await catalogosService.getCatalogos();
		return res.status(200).json({ total, data: catalogos });
	} catch (err) {
		next(err)
	}
};

const getCatalogosDetails = async (req, res, next) => {
	const { idCatalogo } = req.params || {};
	try {
		const { catalogos, total } = await catalogosService.getCatalogosDetails(idCatalogo);
		return res.status(200).json({ total, data: catalogos });
	} catch (err) {
		next(err)
	}
};

const getCatalogosFromIndicador = async (req, res, next) => {
	try {
		const { idIndicador } = req.matchedData || {};
		const data = await catalogosService.getCatalogosFromIndicador(idIndicador);
		return res.status(200).json({ data });
	} catch (err) {
		next(err)
	}
};

const updateOrCreateCatalogFromIndicador = async (req, res, next) => {
	const { idIndicador, catalogos } = req.matchedData;
	await catalogosService.updateOrCreateCatalogosFromIndicador(idIndicador, catalogos);
	return res.sendStatus(204);
};


module.exports = {
	getCatalogos,
	getCatalogosDetails,
	getCatalogosFromIndicador,
	updateOrCreateCatalogFromIndicador,
};
