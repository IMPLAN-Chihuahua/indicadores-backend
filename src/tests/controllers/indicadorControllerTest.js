/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
require('dotenv').config();

chai.use(chaiHttp);
const { expect } = chai;
const { Indicador, Modulo, Usuario, UsuarioIndicador } = require('../../models');
const { anIndicador, aModulo, indicadorToCreate, aFormula, aVariable, anHistorico, aMapa } = require('../../utils/factories');
const { app, server } = require('../../../app');

const { TOKEN_SECRET } = process.env;

describe('v1/indicadores', function () {

    const activeFilter = {
        anioUltimoValorDisponible: 2019
    };

    const validToken = jwt.sign({ sub: 100 }, TOKEN_SECRET, { expiresIn: '5h' });
    const validIndicador = indicadorToCreate();

    const adminRol = { roles: 'ADMIN' };
    const userRol = { roles: 'USER' };

    const indicadoresList = [
        anIndicador(1),
        anIndicador(2),
        anIndicador(3),
        anIndicador(4),
        anIndicador(5)
    ];
    const dummyModulo = aModulo(1);
    const dummyIndicador = anIndicador(1);

    this.afterAll(function () {
        server.close();
    });

    this.afterEach(function () {
        sinon.restore();
    })

    describe('GET /indicadores', function () {
        it('Should return indicadores of :idModulo', function (done) {
            const findOneFake = sinon.fake.resolves(aModulo)
            const findAndCountAllFake = sinon.fake.resolves(
                { rows: indicadoresList, count: indicadoresList.length });
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    done();
                });
        });


        it('Should return status code 404 if :idModulo does not exist', function (done) {
            const findOneFake = sinon.fake.resolves(null);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res.error).to.exist;
                    expect(res).to.have.status(404);
                    done()
                });
        });

        it('Should return status code 422 with invalid :idModulo', function (done) {
            chai.request(app)
                .get('/api/v1/modulos/notvalid/indicadores')
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    done();
                })
        });

        it('Should return 2 items per page', function (done) {
            const findAndCountAllFake = sinon.fake.resolves({ rows: indicadoresList, count: indicadoresList.length });
            const findOneFake = sinon.fake.resolves(dummyModulo);
            const perPage = 5;
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ perPage })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.totalPages).to.be.at.least(1);
                    expect(res.body.data).to.have.lengthOf(perPage);
                    done();
                });

        });

        it('Should return a list of filtered items', function (done) {
            indicadoresList[0].anioUltimoValorDisponible = 2019;
            indicadoresList[1].anioUltimoValorDisponible = 2019;
            const rows = [indicadoresList[0], indicadoresList[1]];
            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake)
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ anioUltimoValorDisponible: 2019, page: 1, perPage: 2 })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(activeFilter).is.not.empty;
                    expect(res).to.have.status(200);
                    expect(res.body.totalPages).to.be.at.least(1);
                    expect(res.body.data).to.have.length.within(0, 2);
                    expect(res.body.data[0].anioUltimoValorDisponible).to.be.equals(2019);
                    done();
                });
        });

        it('Should return a list with a negative tendency', function (done) {
            indicadoresList[0].tendenciaActual = 'DESCENDENTE';
            indicadoresList[1].tendenciaActual = 'DESCENDENTE';
            const rows = [indicadoresList[0], indicadoresList[1]];
            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake)
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ tendenciaActual: 'DESCENDENTE' })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    expect(res.body.data[0].tendenciaActual).to.be.equals('DESCENDENTE');
                    done();
                });
        });

        it('Should return an individual item', function (done) {
            const findOneFake = sinon.fake.resolves(dummyIndicador);
            sinon.replace(Indicador, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/indicadores/1')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data.id).to.equal(dummyIndicador.id);
                    expect(res.body.data.nombre).to.equal(dummyIndicador.nombre);
                    expect(res.body.data.codigo).to.equal(dummyIndicador.codigo);
                    done();
                });
        });

        it('Should return status code 422 if :idIndicador is invalid', function (done) {
            chai.request(app)
                .get('/api/v1/indicadores/uno')
                .end(function (err, res) {
                    expect(res.error).to.not.be.null;
                    expect(res).to.have.status(422);
                    done();
                });
        });

        it('Should return not found if :idModulo does not exist', function (done) {
            const findOneFake = sinon.fake.resolves(null);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(404);
                    done();
                })
        });

        it('Should return a list of indicadores filtered by idOds', function (done) {
            indicadoresList[0].idOds = 1;
            indicadoresList[1].idOds = 1;
            const rows = [indicadoresList[0], indicadoresList[1]];

            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);

            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);

            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ idOds: 1 })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data[0].idOds).to.be.equal(1);
                    done();
                });
        });

        it('Should not process request if indicadores is filtered by an invalid idOds', function (done) {
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ idOds: 'undefinedId' })
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    done();
                });
        });

        it('Should return a list of ordered indicadores by name', function (done) {
            indicadoresList[0].nombre = 'A';
            indicadoresList[1].nombre = 'B';
            const rows = [indicadoresList[0], indicadoresList[1]];

            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);

            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);

            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ sortBy: 'nombre', order: 'asc' })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    const comparison = res.body.data[0].nombre.localeCompare(res.body.data[1].nombre);
                    expect(comparison).to.be.equals(-1);
                    done();
                });
        });

        it('Should return not found if sort by or order is undefined', function (done) {
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ sortBy: 'invalid', order: 'invalid' })
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    done();
                });
        })

    });

    describe('POST /indicadores', function () {
        let accessRolFake;

        this.beforeEach(function () {
            accessRolFake = sinon.fake.resolves({ dataValues: adminRol });
            sinon.replace(Usuario, 'findOne', accessRolFake);
        });

        it('Should create an indicador successfully', function (done) {
            const createFake = sinon.fake.resolves(anIndicador());
            sinon.replace(Indicador, 'create', createFake);
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(accessRolFake.calledOnce).to.be.true;
                    expect(createFake.calledOnce).to.be.true;
                    expect(res.body.data, 'data not undefiend').to.not.be.undefined;
                    expect(res).to.have.status(201);
                    done();
                });
        });

        it('Should create an indicador with formula and variables', function(done) {
            const toCreate = indicadorToCreate();
            const formula = aFormula(1);
            formula.variables = [aVariable(), aVariable()];
            toCreate.formula = formula;
            const createFake = sinon.fake.resolves(anIndicador(1));
            sinon.replace(Indicador, 'create', createFake);
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(toCreate)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    done()
                });
        });

        it('Should fail to create an indicador with formula and variables', function(done) {
            const toCreate = indicadorToCreate();
            const formula = aFormula(1);
            const badVariable = aVariable();
            badVariable.codigoAtributo = 'incorrect';
            formula.variables = [badVariable];
            toCreate.formula = formula;
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(toCreate)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(422);
                    expect(res.body.errors).to.be.an('array');
                    done()
                });
        });

        it('Should create an indicador with historicos', function(done) {
            const toCreate = indicadorToCreate();
            toCreate.historicos = [anHistorico()];
            const createFake = sinon.fake.resolves(anIndicador(1));
            sinon.replace(Indicador, 'create', createFake);
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(toCreate)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(createFake.calledOnce).to.be.true;
                    done()
                });
        });

        it('Should fail to create an indicador with bad formatted historicos', function(done) {
            const toCreate = indicadorToCreate();
            const badHistorico = anHistorico();
            badHistorico.anio = 'not a year';
            badHistorico.valor = 'not a number';
            toCreate.historicos = [badHistorico];
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(toCreate)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(422);
                    expect(res.body.errors).to.be.an('array').with.lengthOf(2);
                    done()
                });
        });

        it('Should create an indicador with a mapa', function(done) {
            const toCreate = indicadorToCreate();
            toCreate.mapa = aMapa();
            const createFake = sinon.fake.resolves(anIndicador(1));
            sinon.replace(Indicador, 'create', createFake);
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(toCreate)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(createFake.calledOnce).to.be.true;
                    done()
                });
        });

        it('Should fail to create an indicador with a bad formatted mapa', function(done) {
            const toCreate = indicadorToCreate();
            const badMapa = aMapa();
            badMapa.url = 'not a url pattern';
            toCreate.mapa = badMapa;
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(toCreate)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(422);
                    expect(res.body.errors).to.be.an('array').with.lengthOf(1);
                    done()
                });
        });

        it('Should fail to create indicador due to semantic errors', function (done) {
            const invalidIndicador = indicadorToCreate();
            invalidIndicador.codigo = 'not valid'
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(invalidIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    expect(accessRolFake.calledOnce).to.be.false;
                    done();
                });

        });

        it('Should not create indicador because req does not have the token', function (done) {
            chai.request(app)
                .post('/api/v1/indicadores')
                .send(validIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    expect(accessRolFake.calledOnce).to.be.false;
                    done();
                });
        });

        it('Should not create indicador because token expired', function (done) {
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: 'Bearer valid' })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(accessRolFake.calledOnce).to.be.false;
                    expect(res).to.have.status(403)
                    done()
                });
        });

        it('Should not create indicador because user has no permission', function (done) {
            sinon.restore()
            const accessRolUserFake = sinon.fake.resolves({ dataValues: userRol });
            sinon.replace(Usuario, 'findOne', accessRolUserFake);
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(accessRolUserFake.calledOnce).to.be.true;
                    expect(accessRolFake.calledOnce).to.be.false;
                    expect(res).to.have.status(403);
                    done();
                });
        });

        it('Should not create indicador because connection to DB failed', function (done) {
            const createFake = sinon.fake.rejects(new Error('Connection to DB failed'));
            sinon.replace(Indicador, 'create', createFake);
            chai.request(app)
                .post('/api/v1/indicadores')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(accessRolFake.calledOnce).to.be.true;
                    expect(createFake.calledOnce).to.be.true;
                    expect(res).to.have.status(500);
                    expect(res.error.text).to.not.be.empty
                    done();
                })
        });
    });

    describe('PATCH /indicadores/:idIndicador', function () {

        it('Should update indicador successfully (admin rol)', function (done) {
            const updateIndicadorFake = sinon.fake.resolves(1);
            sinon.replace(Indicador, 'update', updateIndicadorFake);
            const findOneFake = sinon.fake.resolves({ dataValues: adminRol });
            sinon.replace(Usuario, 'findOne', findOneFake);

            chai.request(app)
                .patch('/api/v1/indicadores/1')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(204);
                    expect(updateIndicadorFake.calledOnce).to.be.true;
                    done();
                })
        });

        it('Should update indicador successfully (user rol)', function (done) {
            const updateIndicadorFake = sinon.fake.resolves(1);
            sinon.replace(Indicador, 'update', updateIndicadorFake);

            const accessRolUserFake = sinon.fake.resolves({ dataValues: userRol });
            sinon.replace(Usuario, 'findOne', accessRolUserFake);

            const findOneFake = sinon.fake.resolves({ dataValues: { count: 1 } })
            sinon.replace(UsuarioIndicador, 'findOne', findOneFake);

            chai.request(app)
                .patch('/api/v1/indicadores/1')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(204);
                    expect(accessRolUserFake.calledOnce).to.be.true;
                    expect(updateIndicadorFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    done();
                });
        });

        it('Should update indicador and have a side effect with the historicos of an indicador');

        it('Should not update indicador due to semantic errors', function (done) {
            const invalidIndicador = indicadorToCreate();
            invalidIndicador.tendenciaActual = 1;
            invalidIndicador.codigo = 'not valid';
            invalidIndicador.anioUltimoValorDisponible = 'not valid';
            chai.request(app)
                .patch('/api/v1/indicadores/1')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(invalidIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    done();
                });
        });

        it('Should not update indicador because token is not present', function (done) {
            chai.request(app)
                .patch('/api/v1/indicadores/1')
                .send(validIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                })
        });

        it('Should not update indicador because token is invalid', function (done) {
            chai.request(app)
                .patch('/api/v1/indicadores/1')
                .set({ Authorization: 'Bearer notvalid' })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        });

        it('Should not update indicador because user rol has no permission over other indicadores', function (done) {
            const findOneFake = sinon.fake.resolves({ dataValues: { count: 0 } });
            sinon.replace(UsuarioIndicador, 'findOne', findOneFake);

            const accessRolUserFake = sinon.fake.resolves({ dataValues: userRol });
            sinon.replace(Usuario, 'findOne', accessRolUserFake);

            chai.request(app)
                .patch('/api/v1/indicadores/2')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(403);
                    expect(res.error.text).to.be.equal('No tiene permiso para actualizar este indicador');
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(accessRolUserFake.calledOnce).to.be.true;
                    done();
                });
        });

        it('Should not update because connection to DB fails', function (done) {
            const accessRolUserFake = sinon.fake.resolves({ dataValues: userRol });
            sinon.replace(Usuario, 'findOne', accessRolUserFake);

            const findOneFake = sinon.fake.resolves({ dataValues: { count: 1 } })
            sinon.replace(UsuarioIndicador, 'findOne', findOneFake);

            const updateIndicadorFake = sinon.fake.rejects(new Error('Connection to DB failed'));
            sinon.replace(Indicador, 'update', updateIndicadorFake);

            chai.request(app)
                .patch('/api/v1/indicadores/1')
                .set({ Authorization: `Bearer ${validToken}` })
                .send(validIndicador)
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    expect(updateIndicadorFake.calledOnce).to.be.true;
                    expect(accessRolUserFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    done();
                });
        });
    });

});