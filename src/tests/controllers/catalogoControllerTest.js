/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const { expect } = chai;
chai.use(chaiHttp);
const { app, server } = require('../../../app');
const { CatalogoDetail } = require('../../models');
const { aDummyWithName } = require('../../utils/factories');

const { TOKEN_SECRET } = process.env;

describe('/catalogos', function () {

	const token = jwt.sign({ sub: 1 }, TOKEN_SECRET, { expiresIn: '5h' }); 1

	const setOfItems = [aDummyWithName(1), aDummyWithName(2), aDummyWithName(3)];

	this.afterEach(function () {
		sinon.restore();
	});

	this.afterAll(function () {
		server.close();
	});

	it('Should return a list of Catalogos', function (done) {
		sinon.replace(CatalogoDetail, 'findAll', sinon.fake.resolves(setOfItems));

		chai.request(app)
			.get('/api/v1/catalogos')
			.end(function (err, res) {
				console.log(res.body)
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res.body.ods).to.be.an('array');
				expect(res.body.coberturas).to.have.lengthOf(setOfItems.length);
				expect(res.body.unidadMedida).to.be.an('array').that.is.not.empty;
				done();
			});
	});


	it('Should not return Catalogos', function (done) {
		sinon.replace(CatalogoDetail, 'findAll', sinon.fake.rejects());

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
				sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
				chai.request(app)
					.get('/api/v1/catalogos/ods')
					.set('Authorization', `Bearer ${token}`)
					.end(function (err, res) {
						expect(findAndCountAllFake.calledOnce).to.be.true;
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						expect(res.body.data.ods).to.be.an('array');
						expect(res.body.data.ods).to.have.lengthOf(setOfItems.length);
						done();
					});
			});

			it('Should not return a list of Ods due to internal server error', function (done) {
				const findAndCountAllFake = sinon.fake.rejects();
				sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
				chai.request(app)
					.get('/api/v1/catalogos/ods')
					.set('Authorization', `Bearer ${token}`)
					.end(function (error, res) {
						expect(findAndCountAllFake.calledOnce).to.be.true;
						expect(res).to.have.status(500);
						done();
					});
			});

			it('Should return a singular ODS', function (done) {
				const findOneFake = sinon.fake.resolves(setOfItems[0]);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not return a list of ODS due to unauthorized request', function (done) {
				chai.request(app)
					.get('/api/v1/catalogos/ods')
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(401);
						done();
					});
			});

			it('Should not return a list of ODS due to invalid token', function (done) {
				chai.request(app)
					.get('/api/v1/catalogos/ods')
					.set('Authorization', `Bearer ${123}`)
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(403);
						done();
					});
			});

			it('Should not return an ODS due to unauthorized request', function (done) {
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
			it('Should create a new ODS', function (done) {
				const dummyODS = setOfItems[0];
				const createFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'create', createFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not create a new ODS due to internal server error', function (done) {
				const createFake = sinon.fake.rejects();
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'create', createFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not create a new ODS due to unauthorized', function (done) {
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
			it('Should update an ODS', function (done) {
				const dummyODS = setOfItems[0];
				const updateFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'update', updateFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not update an ODS because of name repetition', function (done) {
				const dummyODS = setOfItems[0];
				const updateFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(true);
				sinon.replace(CatalogoDetail, 'update', updateFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
				chai.request(app)
					.patch('/api/v1/catalogos/ods/1')
					.set('Authorization', `Bearer ${token}`)
					.send(dummyODS.nombre)
					.end(function (err, res) {
						expect(res).to.have.status(409);
						done();
					});
			});

			it('Should not update an ODS due to authentication error', function (done) {
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
			it('Should delete an ODS', function (done) {
				const deleteFake = sinon.fake.resolves();
				const findOneFake = sinon.fake.resolves(true);
				sinon.replace(CatalogoDetail, 'destroy', deleteFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not delete an ODS due to non-existence', function (done) {
				const deleteFake = sinon.fake.resolves();
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'destroy', deleteFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
				chai.request(app)
					.delete('/api/v1/catalogos/ods/1')
					.set('Authorization', `Bearer ${token}`)
					.end(function (err, res) {
						expect(res).to.have.status(404);
						done();
					});
			});

			it('Should not delete an ODS due to unauthorized request', function (done) {
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
				sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
				chai.request(app)
					.get('/api/v1/catalogos/cobertura')
					.set('Authorization', `Bearer ${token}`)
					.end(function (err, res) {
						expect(findAndCountAllFake.calledOnce).to.be.true;
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						expect(res.body.data.coberturas).to.be.an('array');
						expect(res.body.data.coberturas).to.have.lengthOf(setOfItems.length);
						done();
					});
			});

			it('Should not return a list of coberturas due to internal server error', function (done) {
				const findAndCountAllFake = sinon.fake.rejects();
				sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
				chai.request(app)
					.get('/api/v1/catalogos/cobertura')
					.set('Authorization', `Bearer ${token}`)
					.end(function (error, res) {
						expect(findAndCountAllFake.calledOnce).to.be.true;
						expect(res).to.have.status(500);
						done();
					});
			});

			it('Should return a singular Cobertura', function (done) {
				const findOneFake = sinon.fake.resolves(setOfItems[0]);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not return a list of ODS due to unauthorized request', function (done) {
				chai.request(app)
					.get('/api/v1/catalogos/cobertura')
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(401);
						done();
					});
			});

			it('Should not return a list of Cobertura due to invalid token', function (done) {
				chai.request(app)
					.get('/api/v1/catalogos/cobertura')
					.set('Authorization', `Bearer ${123}`)
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(403);
						done();
					});
			});

			it('Should not return a Cobertura due to unauthorized request', function (done) {
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
			it('Should create a new Cobertura', function (done) {
				const dummyODS = setOfItems[0];
				const createFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'create', createFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not create a new ODS due to internal server error', function (done) {
				const createFake = sinon.fake.rejects();
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'create', createFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not create a new ODS due to unauthorized', function (done) {
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
			it('Should update a Cobertura', function (done) {
				const dummyODS = setOfItems[0];
				const updateFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'update', updateFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not update a Cobertura because of name repetition', function (done) {
				const dummyODS = setOfItems[0];
				const updateFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(true);
				sinon.replace(CatalogoDetail, 'update', updateFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
				chai.request(app)
					.patch('/api/v1/catalogos/cobertura/1')
					.set('Authorization', `Bearer ${token}`)
					.send(dummyODS.nombre)
					.end(function (err, res) {
						expect(res).to.have.status(409);
						done();
					});
			});

			it('Should not update a Cobertura due to authentication error', function (done) {
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
			it('Should delete a Cobertura', function (done) {
				const deleteFake = sinon.fake.resolves();
				const findOneFake = sinon.fake.resolves(true);
				sinon.replace(CatalogoDetail, 'destroy', deleteFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not delete a cobertura due to non-existence', function (done) {
				const deleteFake = sinon.fake.resolves();
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'destroy', deleteFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
				chai.request(app)
					.delete('/api/v1/catalogos/cobertura/1')
					.set('Authorization', `Bearer ${token}`)
					.end(function (err, res) {
						expect(res).to.have.status(404);
						done();
					});
			});

			it('Should not delete a cobertura due to unauthorized request', function (done) {
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
				sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
				chai.request(app)
					.get('/api/v1/catalogos/unidadMedida')
					.set('Authorization', `Bearer ${token}`)
					.end(function (err, res) {
						expect(findAndCountAllFake.calledOnce).to.be.true;
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						expect(res.body.data.unidades).to.be.an('array');
						expect(res.body.data.unidades).to.have.lengthOf(setOfItems.length);
						done();
					});
			});

			it('Should not return a list of unidades due to internal server error', function (done) {
				const findAndCountAllFake = sinon.fake.rejects();
				sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
				chai.request(app)
					.get('/api/v1/catalogos/unidadMedida')
					.set('Authorization', `Bearer ${token}`)
					.end(function (error, res) {
						expect(findAndCountAllFake.calledOnce).to.be.true;
						expect(res).to.have.status(500);
						done();
					});
			});

			it('Should return a singular Unidad', function (done) {
				const findOneFake = sinon.fake.resolves(setOfItems[0]);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not return a list of Unidades due to unauthorized request', function (done) {
				chai.request(app)
					.get('/api/v1/catalogos/unidadMedida')
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(401);
						done();
					});
			});

			it('Should not return a list of Unidades due to invalid token', function (done) {
				chai.request(app)
					.get('/api/v1/catalogos/unidadMedida')
					.set('Authorization', `Bearer ${123}`)
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(403);
						done();
					});
			});

			it('Should not return an Unidad due to unauthorized request', function (done) {
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
			it('Should create a new Unidad', function (done) {
				const dummyODS = setOfItems[0];
				const createFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'create', createFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not create a new Unidad due to internal server error', function (done) {
				const createFake = sinon.fake.rejects();
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'create', createFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not create a new Unidad due to unauthorized', function (done) {
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
			it('Should update an Unidad', function (done) {
				const dummyODS = setOfItems[0];
				const updateFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'update', updateFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not update an Unidad because of name repetition', function (done) {
				const dummyODS = setOfItems[0];
				const updateFake = sinon.fake.resolves(dummyODS);
				const findOneFake = sinon.fake.resolves(true);
				sinon.replace(CatalogoDetail, 'update', updateFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
				chai.request(app)
					.patch('/api/v1/catalogos/unidadMedida/1')
					.set('Authorization', `Bearer ${token}`)
					.send(dummyODS.nombre)
					.end(function (err, res) {
						expect(res).to.have.status(409);
						done();
					});
			});

			it('Should not update an Unidad due to authentication error', function (done) {
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
			it('Should delete an Unidad', function (done) {
				const deleteFake = sinon.fake.resolves();
				const findOneFake = sinon.fake.resolves(true);
				sinon.replace(CatalogoDetail, 'destroy', deleteFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
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

			it('Should not delete an Unidad due to non-existence', function (done) {
				const deleteFake = sinon.fake.resolves();
				const findOneFake = sinon.fake.resolves(false);
				sinon.replace(CatalogoDetail, 'destroy', deleteFake);
				sinon.replace(CatalogoDetail, 'findOne', findOneFake);
				chai.request(app)
					.delete('/api/v1/catalogos/unidadMedida/1')
					.set('Authorization', `Bearer ${token}`)
					.end(function (err, res) {
						expect(res).to.have.status(404);
						done();
					});
			});

			it('Should not delete an Unidad due to unauthorized request', function (done) {
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