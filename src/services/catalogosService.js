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
	return getCatalogoDetailsOfIndicaor(idIndicador, [['nombre', 'description'], ['idCatalogo']])
};


const updateOrCreateCatalogosFromIndicador = async (idIndicador, details) => {
	try {
		const existing = await getCatalogoDetailsOfIndicaor(idIndicador, ['idCatalogo'])
		if (existing.length === 0) {
			await addCatalogoDetailsToIndicador(details.map(c => c.id), idIndicador)
			return;
		}

		const toUpdate = await getCatalogoDetailsToUpdate(details, existing);
		if (toUpdate.length === 0) return;

		return updateExistingCatalogoDetailsWtih(existing, toUpdate)
	} catch (err) {
		console.log(err)
	}
}


const getCatalogoDetailsToUpdate = async (catalogos, compareTo) => {
	let toUpdate = []
	for (const detail of catalogos) {
		const alreadyExists = compareTo.find(existing => detail.id === existing.idCatalogoDetail)
		if (alreadyExists) continue;
		toUpdate.push(detail.id)
	}

	const catalogoDetails = await CatalogoDetail.findAll({
		where: { id: toUpdate },
		attributes: ['id', 'idCatalogo'],
		raw: true
	})

	return catalogoDetails;
}


const updateExistingCatalogoDetailsWtih = async (existing, toUpdate) => {
	for (const detail of toUpdate) {
		const detailIndicador = existing.find(catalogo => detail.idCatalogo === catalogo.idCatalogo)

		await CatalogoDetailIndicador.update({ idCatalogoDetail: detail.id }, {
			where: {
				id: detailIndicador.id
			}
		})
	}
}


/**
 * 
 * @param {*} idIndicador 
 * @param {string[][] | string[]} catalogoDetailAttributes related to catalogo detail association [field, alias] -> [nombre, asDescripcion]
 *  if alias is not provided, returned object will have the value of the field name
 * @returns 
 */
const getCatalogoDetailsOfIndicaor = (idIndicador, catalogoDetailAttributes) => {
	let associationAttributes = []
	if (catalogoDetailAttributes.length > 0) {
		associationAttributes = catalogoDetailAttributes.map(catalogo => {
			let field, alias;
			if (Array.isArray(catalogo)) {
				field = catalogo[0];
				alias = catalogo[1]
			} else {
				field = catalogo;
			}
			alias = alias ? alias : field
			return [sequelize.literal(`"catalogoDetail"."${field}"`), `"${alias}"`]
		})
	}
	return CatalogoDetailIndicador.findAll({
		where: { idIndicador },
		attributes: ['id', 'idIndicador', 'idCatalogoDetail', ...associationAttributes],
		include: [{
			model: CatalogoDetail,
			attributes: []
		}],
		raw: true
	});
}


const addCatalogoDetailsToIndicador = async (catalogos, idIndicador) => {
	const relation = catalogos.map(c => ({
		idCatalogoDetail: c,
		idIndicador
	}))

	return CatalogoDetailIndicador.bulkCreate(relation);
}


module.exports = {
	getCatalogos,
	getCatalogosDetails,
	getCatalogosFromIndicador,
	updateOrCreateCatalogosFromIndicador,
	addCatalogosToIndicador: addCatalogoDetailsToIndicador
}