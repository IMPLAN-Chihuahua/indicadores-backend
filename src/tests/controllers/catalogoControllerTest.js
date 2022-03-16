const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const { app, server } = require('../../../app');
const { Ods, CoberturaGeografica, UnidadMedida } = require('../../models');
const sinon = require('sinon');
const { aDummyWithName } = require('../../utils/factories');

const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = process.env;

describe('/catalogos', function () {

    const token = jwt.sign({ sub: 1 }, TOKEN_SECRET, { expiresIn: '5h' });

    let dummyList;

    const setOfItems = [aDummyWithName(1), aDummyWithName(2), aDummyWithName(3)];

    this.beforeAll(function () {
        dummyList = [aDummyWithName(1), aDummyWithName(2), aDummyWithName(3)];
    });

    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    it('Should return a list of Catalogos', function (done) {
        sinon.replace(Ods, 'findAll', sinon.fake.resolves(dummyList));
        sinon.replace(CoberturaGeografica, 'findAll', sinon.fake.resolves(dummyList));
        sinon.replace(UnidadMedida, 'findAll', sinon.fake.resolves(dummyList));

        chai.request(app)
            .get('/api/v1/catalogos')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.ods).to.be.an('array');
                expect(res.body.coberturas).to.have.lengthOf(dummyList.length);
                expect(res.body.unidadMedida).to.be.an('array').that.is.not.empty;
                done();
            });
    });

  
    it('Should not return Catalogos', function (done) {
        sinon.replace(Ods, 'findAll', sinon.fake.rejects());
        sinon.replace(UnidadMedida, 'findAll', sinon.fake.resolves(dummyList));
        sinon.replace(CoberturaGeografica, 'findAll', sinon.fake.resolves(dummyList));

        chai.request(app)
            .get('/api/v1/catalogos')
            .end(function (err, res) {
                expect(res.body).to.be.empty;
                expect(res).to.have.status(500);
                done();
            });
    });

    describe('catalogos/ods', function () {
        describe('GET', function () {
            it('Should return a list of Ods', function (done) {
                const findAndCountAllFake = sinon.fake.resolves({ rows: setOfItems, count: setOfItems.length });
                sinon.replace(Ods, 'findAndCountAll', findAndCountAllFake);
                chai.request(app)
                    .get('/api/v1/catalogos/ods')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.data.ods).to.be.an('array');
                        expect(res.body.data.ods).to.have.lengthOf(dummyList.length);
                        done();
                    });
            });

            it('Should not return a list of Ods due to internal server error', function (done) {
                const findAndCountAllFake = sinon.fake.rejects();
                sinon.replace(Ods, 'findAndCountAll', findAndCountAllFake);
                chai.request(app)
                    .get('/api/v1/catalogos/ods')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (error, res) 
                    {
                        expect (findAndCountAllFake.calledOnce).to.be.true;
                        expect(res).to.have.status(500);
                        done();
                    });
            });

            it('Should return a singular ODS', function (done) {
                const findOneFake = sinon.fake.resolves(setOfItems[0]);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .get('/api/v1/catalogos/ods/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(res.body.data.id).to.equal(setOfItems[0].id);
                        expect(res.body.data.nombre).to.equal(setOfItems[0].nombre);
                        expect(err).to.be.null;
                        done();
                    });
            });
            
            it('Should not return an ODS', function (done) {
                const findOneFake = sinon.fake.resolves(null);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .get('/api/v1/catalogos/ods/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.have.status(404);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not return an ODS due to internal server error', function (done) {
                const findOneFake = sinon.fake.rejects();
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .get('/api/v1/catalogos/ods/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.have.status(500);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not return a list of ODS due to unauthorized request', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/ods')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });

            it('Should not return a list of ODS due to invalid token', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/ods')
                    .set('Authorization', `Bearer ${123}`)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(403);
                        done();
                    });
            });

            it('Should not return an ODS due to unauthorized request', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/ods/1')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('POST', function () {
            it('Should create a new ODS', function(done) {
                const dummyODS = setOfItems[0];
                const createFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(Ods, 'create', createFake);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .post('/api/v1/catalogos/ods')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.have.status(201);
                        expect(res.body.data.nombre).to.equal(setOfItems[0].nombre);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not create a new ODS due to internal server error', function(done) {
                const createFake = sinon.fake.rejects();
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(Ods, 'create', createFake);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .post('/api/v1/catalogos/ods')
                    .set('Authorization', `Bearer ${token}`)
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.have.status(500);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not create a new ODS due to unauthorized', function(done) {
                chai.request(app)
                    .post('/api/v1/catalogos/ods')
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('PATCH', function () {
            it('Should update an ODS', function(done) {
                const dummyODS = setOfItems[0];
                const updateFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(Ods, 'update', updateFake);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .patch('/api/v1/catalogos/ods/1')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not update an ODS because of name repetition', function(done) {
                const dummyODS = setOfItems[0];
                const updateFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(true);
                sinon.replace(Ods, 'update', updateFake);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .patch('/api/v1/catalogos/ods/1')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(res).to.have.status(409);
                        done();
                    });
            });

            it('Should not update an ODS due to authentication error', function(done) {
                chai.request(app)
                    .patch('/api/v1/catalogos/ods/1')
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('DELETE', function () {
            it('Should delete an ODS', function(done) {
                const deleteFake = sinon.fake.resolves();
                const findOneFake = sinon.fake.resolves(true);
                sinon.replace(Ods, 'destroy', deleteFake);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .delete('/api/v1/catalogos/ods/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(deleteFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not delete an ODS due to non-existence', function(done) {
                const deleteFake = sinon.fake.resolves();
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(Ods, 'destroy', deleteFake);
                sinon.replace(Ods, 'findOne', findOneFake);
                chai.request(app)
                    .delete('/api/v1/catalogos/ods/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
            
            it('Should not delete an ODS due to unauthorized request', function(done) {
                chai.request(app)
                    .delete('/api/v1/catalogos/ods/1')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });
    });

    describe('catalogos/cobertura', function () {
        describe('GET', function () {
            it('Should return a list of coberturas', function (done) {
                const findAndCountAllFake = sinon.fake.resolves({ rows: setOfItems, count: setOfItems.length });
                sinon.replace(CoberturaGeografica, 'findAndCountAll', findAndCountAllFake);
                chai.request(app)
                    .get('/api/v1/catalogos/cobertura')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.data.coberturas).to.be.an('array');
                        expect(res.body.data.coberturas).to.have.lengthOf(dummyList.length);
                        done();
                    });
            });

            it('Should not return a list of coberturas due to internal server error', function (done) {
                const findAndCountAllFake = sinon.fake.rejects();
                sinon.replace(CoberturaGeografica, 'findAndCountAll', findAndCountAllFake);
                chai.request(app)
                    .get('/api/v1/catalogos/cobertura')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (error, res) 
                    {
                        expect (findAndCountAllFake.calledOnce).to.be.true;
                        expect(res).to.have.status(500);
                        done();
                    });
            });

            it('Should return a singular Cobertura', function (done) {
                const findOneFake = sinon.fake.resolves(setOfItems[0]);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .get('/api/v1/catalogos/cobertura/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(res.body.data.id).to.equal(setOfItems[0].id);
                        expect(res.body.data.nombre).to.equal(setOfItems[0].nombre);
                        expect(err).to.be.null;
                        done();
                    });
            });
            
            it('Should not return a Cobertura', function (done) {
                const findOneFake = sinon.fake.resolves(null);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .get('/api/v1/catalogos/cobertura/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.have.status(404);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not return a list of ODS due to unauthorized request', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/cobertura')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });

            it('Should not return a list of Cobertura due to invalid token', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/cobertura')
                    .set('Authorization', `Bearer ${123}`)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(403);
                        done();
                    });
            });

            it('Should not return a Cobertura due to unauthorized request', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/cobertura/1')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('POST', function () {
            it('Should create a new Cobertura', function(done) {
                const dummyODS = setOfItems[0];
                const createFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(CoberturaGeografica, 'create', createFake);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .post('/api/v1/catalogos/cobertura')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.have.status(201);
                        expect(res.body.data.nombre).to.equal(setOfItems[0].nombre);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not create a new ODS due to internal server error', function(done) {
                const createFake = sinon.fake.rejects();
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(CoberturaGeografica, 'create', createFake);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .post('/api/v1/catalogos/cobertura')
                    .set('Authorization', `Bearer ${token}`)
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.have.status(500);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not create a new ODS due to unauthorized', function(done) {
                chai.request(app)
                    .post('/api/v1/catalogos/cobertura')
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('PATCH', function () {
            it('Should update a Cobertura', function(done) {
                const dummyODS = setOfItems[0];
                const updateFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(CoberturaGeografica, 'update', updateFake);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .patch('/api/v1/catalogos/cobertura/1')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not update a Cobertura because of name repetition', function(done) {
                const dummyODS = setOfItems[0];
                const updateFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(true);
                sinon.replace(CoberturaGeografica, 'update', updateFake);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .patch('/api/v1/catalogos/cobertura/1')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(res).to.have.status(409);
                        done();
                    });
            });

            it('Should not update a Cobertura due to authentication error', function(done) {
                chai.request(app)
                    .patch('/api/v1/catalogos/cobertura/1')
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('DELETE', function () {
            it('Should delete a Cobertura', function(done) {
                const deleteFake = sinon.fake.resolves();
                const findOneFake = sinon.fake.resolves(true);
                sinon.replace(CoberturaGeografica, 'destroy', deleteFake);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .delete('/api/v1/catalogos/cobertura/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(deleteFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not delete a cobertura due to non-existence', function(done) {
                const deleteFake = sinon.fake.resolves();
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(CoberturaGeografica, 'destroy', deleteFake);
                sinon.replace(CoberturaGeografica, 'findOne', findOneFake);
                chai.request(app)
                    .delete('/api/v1/catalogos/cobertura/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
            
            it('Should not delete a cobertura due to unauthorized request', function(done) {
                chai.request(app)
                    .delete('/api/v1/catalogos/cobertura/1')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });
    });

    describe('catalogos/unidadMedida', function () {
        describe('GET', function () {
            it('Should return a list of Unidades', function (done) {
                const findAndCountAllFake = sinon.fake.resolves({ rows: setOfItems, count: setOfItems.length });
                sinon.replace(UnidadMedida, 'findAndCountAll', findAndCountAllFake);
                chai.request(app)
                    .get('/api/v1/catalogos/unidadMedida')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        console.log(res.body);
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.data.unidades).to.be.an('array');
                        expect(res.body.data.unidades).to.have.lengthOf(dummyList.length);
                        done();
                    });
            });

            it('Should not return a list of unidades due to internal server error', function (done) {
                const findAndCountAllFake = sinon.fake.rejects();
                sinon.replace(UnidadMedida, 'findAndCountAll', findAndCountAllFake);
                chai.request(app)
                    .get('/api/v1/catalogos/unidadMedida')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (error, res) 
                    {
                        expect (findAndCountAllFake.calledOnce).to.be.true;
                        expect(res).to.have.status(500);
                        done();
                    });
            });

            it('Should return a singular Unidad', function (done) {
                const findOneFake = sinon.fake.resolves(setOfItems[0]);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .get('/api/v1/catalogos/unidadMedida/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(res.body.data.id).to.equal(setOfItems[0].id);
                        expect(res.body.data.nombre).to.equal(setOfItems[0].nombre);
                        expect(err).to.be.null;
                        done();
                    });
            });
            
            it('Should not return an Unidad', function (done) {
                const findOneFake = sinon.fake.resolves(null);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .get('/api/v1/catalogos/unidadMedida/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.have.status(404);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not return a list of Unidades due to unauthorized request', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/unidadMedida')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });

            it('Should not return a list of Unidades due to invalid token', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/unidadMedida')
                    .set('Authorization', `Bearer ${123}`)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(403);
                        done();
                    });
            });

            it('Should not return an Unidad due to unauthorized request', function(done) {
                chai.request(app)
                    .get('/api/v1/catalogos/unidadMedida/1')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('POST', function () {
            it('Should create a new Unidad', function(done) {
                const dummyODS = setOfItems[0];
                const createFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(UnidadMedida, 'create', createFake);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .post('/api/v1/catalogos/unidadMedida')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.have.status(201);
                        expect(res.body.data.nombre).to.equal(setOfItems[0].nombre);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not create a new Unidad due to internal server error', function(done) {
                const createFake = sinon.fake.rejects();
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(UnidadMedida, 'create', createFake);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .post('/api/v1/catalogos/unidadMedida')
                    .set('Authorization', `Bearer ${token}`)
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.have.status(500);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not create a new Unidad due to unauthorized', function(done) {
                chai.request(app)
                    .post('/api/v1/catalogos/unidadMedida')
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('PATCH', function () {
            it('Should update an Unidad', function(done) {
                const dummyODS = setOfItems[0];
                const updateFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(UnidadMedida, 'update', updateFake);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .patch('/api/v1/catalogos/unidadMedida/1')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not update an Unidad because of name repetition', function(done) {
                const dummyODS = setOfItems[0];
                const updateFake = sinon.fake.resolves(dummyODS);
                const findOneFake = sinon.fake.resolves(true);
                sinon.replace(UnidadMedida, 'update', updateFake);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .patch('/api/v1/catalogos/unidadMedida/1')
                    .set('Authorization', `Bearer ${token}`)
                    .send(dummyODS.nombre)
                    .end(function (err, res) {
                        expect(res).to.have.status(409);
                        done();
                    });
            });

            it('Should not update an Unidad due to authentication error', function(done) {
                chai.request(app)
                    .patch('/api/v1/catalogos/unidadMedida/1')
                    .send(setOfItems[0].nombre)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('DELETE', function () {
            it('Should delete an Unidad', function(done) {
                const deleteFake = sinon.fake.resolves();
                const findOneFake = sinon.fake.resolves(true);
                sinon.replace(UnidadMedida, 'destroy', deleteFake);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .delete('/api/v1/catalogos/unidadMedida/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(deleteFake.calledOnce).to.be.true;
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        done();
                    });
            });

            it('Should not delete an Unidad due to non-existence', function(done) {
                const deleteFake = sinon.fake.resolves();
                const findOneFake = sinon.fake.resolves(false);
                sinon.replace(UnidadMedida, 'destroy', deleteFake);
                sinon.replace(UnidadMedida, 'findOne', findOneFake);
                chai.request(app)
                    .delete('/api/v1/catalogos/unidadMedida/1')
                    .set('Authorization', `Bearer ${token}`)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
            
            it('Should not delete an Unidad due to unauthorized request', function(done) {
                chai.request(app)
                    .delete('/api/v1/catalogos/unidadMedida/1')
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });
    });
});