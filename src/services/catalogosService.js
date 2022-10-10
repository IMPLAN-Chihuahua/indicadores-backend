const {
	CatalogoDetail,
	Catalogo,
	CatalogoDetailIndicador,
	sequelize,
} = require('../models');

const getCatalogos = async () => {
	try {
		const result = await Catalogo.findAndCountAll({
			attributes: ['id', 'nombre']
		})
		return {
			catalogos: result.rows,
			total: result.count
		};
	} catch (err) {
		throw new Error(`Error al obtener Catalogos: ${err.message}`);
	}
};

const getCatalogosDetails = async (idCatalogo) => {
	try {
		const result = await CatalogoDetail.findAndCountAll({
			where: {
				idCatalogo: idCatalogo
			},
			attributes: ['id', 'nombre', 'idCatalogo']
		});
		return {
			catalogos: result.rows,
			total: result.count
		};
	} catch (err) {
		throw new Error(`Error al obtener Catalogos: ${err.message}`);
	}
};

const getCatalogosFromIndicador = async (idIndicador) => {
	try {
		const result = await CatalogoDetailIndicador.findAll({
			where: {
				idIndicador: idIndicador
			},
			attributes: ['id', 'idIndicador', 'idCatalogoDetail', [sequelize.literal('"catalogoDetail"."nombre"'), "descripcion"], [sequelize.literal('"catalogoDetail"."idCatalogo"'), "idCatalogo"]],
			include: [{
				model: CatalogoDetail,
				attributes: [],
				required: false
			}]

		});
		return result;
	} catch (err) {
		throw new Error(`Error al obtener Catalogos: ${err.message}`);
	};
};


module.exports = {
	getCatalogos,
	getCatalogosDetails,
	getCatalogosFromIndicador
}