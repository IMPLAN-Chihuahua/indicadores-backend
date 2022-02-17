const faker = require('faker');

const aDummyWithName = (id) => {
    return {
        id: id,
        nombre: faker.random.word()
    };
};

const anIndicador = (id) => {
    return {
        dataValues: {
        id,
        nombre: "Test " + faker.random.word(),
        definicion: faker.lorem.sentence(),
        urlImagen: faker.image.imageUrl(),
        idOds: faker.datatype.number(15),
        ods: faker.random.word(),
        idModulo: faker.datatype.number(10),
        modulo: faker.random.word(),
        ultimoValorDisponible: faker.datatype.number(),
        idUnidadMedida: faker.datatype.number(10),
        unidadMedida: faker.random.word(),
        anioUltimoValorDisponible: faker.datatype.number({ 'min': 2000, 'max': new Date().getFullYear() }),
        idCobertura: faker.datatype.number(10),
        coberturaGeografica: faker.random.word(),
        tendenciaActual: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
        tendenciaDeseada: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
        mapa: faker.datatype.number(10),
        Mapa: {
            id: faker.datatype.number(10),
            ubicacion: faker.random.word(),
            url: faker.image.imageUrl()
        },
        Formula: {
            id: faker.datatype.number(10),
            ecuacion: 'Z=x^2 + y^2',
            descripcion: faker.lorem.sentence(),
            Variables: [{
                dataValues: {
                    nombre: faker.random.word(),
                    nombreAtributo: faker.random.word(),
                    dato: faker.datatype.number(),
                    Unidad: faker.random.word()
                }
            }]
        },
        Historicos: [{
            dataValues: {
                anio: faker.datatype.number({ 'min': 2000, 'max': new Date().getFullYear() }),
                valor: faker.datatype.number(),
                fuente: faker.random.word()
            },
        }],
        codigo: '00' + faker.datatype.number(9),
        codigoObjeto: '00' + faker.datatype.number(9),
        createdAt: new Date(),
        updatedAt: new Date(),
    }};
};

const aUser = (id) => {
    return {
        id,
        nombres: faker.name.firstName(),
        apellidoPaterno: faker.name.lastName(),
        apellidoMaterno: faker.name.lastName(),
        correo: faker.internet.email(),
        clave: faker.internet.password(8, false),
        idRol: 1
    };
};

const aModulo = (id) => {
    return {
        id,
        temaIndicador: faker.random.word(),
        codigo: '00' + faker.datatype.number(9),
        observaciones: faker.lorem.words(20),
        activo: faker.datatype.boolean() ? 'SI' : 'NO',
        urlImagen: faker.image.imageUrl(),
        color: '#2d2d2d'
    };
};

const aRol = (id) => {
    return {
        id,
        rol: faker.random.word().toUpperCase(),
        descripcion: faker.lorem.words(8),
        activo: faker.datatype.boolean ? 'SI' : 'NO',
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

module.exports = {
    anIndicador,
    aUser,
    aModulo,
    aDummyWithName,
    aRol
};