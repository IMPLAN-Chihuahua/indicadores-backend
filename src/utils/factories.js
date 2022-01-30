const faker = require('faker');

const aDummyWithName = (id) => {
    return {
        id: id,
        nombre: faker.random.word()
    };
};

const anIndicador = (id) => {
    return {
        id,
        urlImagen: faker.image.imageUrl(),
        nombre: "Test " + faker.random.word(),
        codigo: '00' + faker.datatype.number(9),
        codigoObjeto: '00' + faker.datatype.number(9),
        ultimoValorDisponible: faker.datatype.number(),
        anioUltimoValorDisponible: faker.datatype.number({ 'min': 2000, 'max': new Date().getFullYear() }),
        idModulo: faker.datatype.number(10),
        idOds: faker.datatype.number(15),
        idCobertura: faker.datatype.number(10),
        idUnidadMedida: faker.datatype.number(10),
        createdAt: new Date(),
        updatedAt: new Date(),
        tendenciaActual: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
        definicion: faker.lorem.sentence(),
        tendenciaDeseada: faker.datatype.boolean() ? "ASCENDENTE" : "DESCENDENTE",
    };
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