const faker = require('faker');
const { Modulo } = require('../models')

const aDummyWithName = (id) => ({
	id,
	nombre: faker.random.word()
});

const aCodigo = () => `${faker.datatype.number(9)}${faker.datatype.number(9)}${faker.datatype.number(9)}`;
const randomYear = () => faker.datatype.number({ 'min': 2000, 'max': new Date().getFullYear() });

const anIndicador = (id) => ({
	id,
	nombre: `Test ${faker.random.word()}`,
	definicion: faker.lorem.sentence(),
	urlImagen: faker.image.imageUrl(),
	idOds: faker.datatype.number(15),
	ods: faker.random.word(),
	idModulo: faker.datatype.number(10),
	modulo: faker.random.word(),
	ultimoValorDisponible: faker.datatype.number(),
	idUnidadMedida: faker.datatype.number(10),
	unidadMedida: faker.random.word(),
	anioUltimoValorDisponible: randomYear(),
	idCobertura: faker.datatype.number(10),
	coberturaGeografica: faker.random.word(),
	tendenciaActual: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
	tendenciaDeseada: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
	mapa: {
		id: faker.datatype.number(10),
		ubicacion: faker.random.word(),
		url: faker.image.imageUrl()
	},
	formula: {
		id: faker.datatype.number(10),
		ecuacion: 'Z=x^2 + y^2',
		descripcion: faker.lorem.sentence(),
		variables: [{
			dataValues: {
				nombre: faker.random.word(),
				nombreAtributo: faker.random.word(),
				dato: faker.datatype.number(),
				Unidad: faker.random.word()
			}
		}]
	},
	historicos: [{
		dataValues: {
			anio: randomYear(),
			valor: faker.datatype.number(),
			fuente: faker.random.word()
		},
	}],
	codigo: aCodigo(),
	codigoObjeto: aCodigo(),
	createdAt: new Date(),
	createdBy: faker.datatype.number(9),
	updatedAt: new Date(),
});

const indicadorToCreate = () => ({
	nombre: faker.random.word(),
	codigo: aCodigo(),
	codigoObjeto: aCodigo(),
	definicion: faker.lorem.sentence(),
	ultimoValorDisponible: faker.datatype.number(),
	anioUltimoValorDisponible: randomYear(),
	tendenciaActual: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
	tendenciaDeseada: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
	observaciones: faker.random.words(10),
	idOds: faker.datatype.number(9),
	idCobertura: faker.datatype.number(9),
	idUnidadMedida: faker.datatype.number(9),
	idModulo: 1,
	createdBy: faker.datatype.number(9),
	updatedBy: faker.datatype.number(9)
});

const aFormula = () => ({
	ecuacion: '\\frac{1}{x^2-1}',
	descripcion: faker.lorem.words(20)
});

const aVariable = () => ({
	nombre: faker.lorem.word(),
	codigoAtributo: aCodigo(),
	nombreAtributo: faker.lorem.word(),
	dato: faker.datatype.number(),
	idUnidad: 1
});

const anHistorico = () => ({
	anio: randomYear(),
	valor: faker.datatype.number(),
	fuente: faker.random.word()
});

const aMapa = () => ({
	ubicacion: faker.random.word(),
	url: faker.internet.url()
});

const aUser = (id) => ({
	id,
	nombres: faker.name.firstName(),
	apellidoPaterno: faker.name.lastName(),
	apellidoMaterno: faker.name.lastName(),
	correo: faker.internet.email(),
	clave: faker.internet.password(8, false),
	activo: 'SI',
	idRol: 1,
	requestedPasswordChange: id % 2 === 0 ? 'SI' : 'NO',
});

const aModulo = (id) => {
	const modulo = Modulo.build({
		id,
		codigo: aCodigo(),
		temaIndicador: faker.company.bsNoun(),
		observaciones: faker.lorem.words(20),
		activo: faker.datatype.boolean() ? 'SI' : 'NO',
		urlImagen: faker.image.imageUrl(),
		color: faker.commerce.color(),
		descripcion: faker.lorem.paragraph(),
	});
	modulo.validate();
	return modulo;
}

const aRol = (id) => ({
	id,
	rol: faker.random.word().toUpperCase(),
	descripcion: faker.lorem.words(8),
	activo: faker.datatype.boolean ? 'SI' : 'NO',
	createdAt: new Date(),
	updatedAt: new Date()
});



/** Catalogos */

const someCatalogos = (id) => ([
	{
		id,
		nombre: 'ODS',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: id + 1,
		nombre: 'Unidad Medida',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: id + 2,
		nombre: 'Cobertura Geográfica',
		createdAt: new Date(),
		updatedAt: new Date()
	},
]);

const someCatalogosDetails = (id, idCatalogo) => ([
	{
		id,
		nombre: faker.random.word(),
		idCatalogo,
		createdAt: new Date(),
		updatedAt: new Date()
	}
]);

const someCatalogosFromIndicador = (idIndicador) => ([
	{
		id: 1,
		idIndicador,
		idCatalogoDetail: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 2,
		idIndicador,
		idCatalogoDetail: 2,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 3,
		idIndicador,
		idCatalogoDetail: 3,
		createdAt: new Date(),
		updatedAt: new Date()
	},
]);

module.exports = {
	anIndicador,
	aUser,
	aModulo,
	aDummyWithName,
	aRol,
	indicadorToCreate,
	aFormula,
	aVariable,
	anHistorico,
	aMapa,
	someCatalogos,
	someCatalogosDetails,
	someCatalogosFromIndicador,
	aCodigo,
	randomYear
};