/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

require('dotenv').config();

chai.use(chaiHttp);
const { expect } = chai;
const { Indicador, Modulo, Usuario, Mapa,
	UsuarioIndicador, Formula } = require('../../models');
const { anIndicador, aModulo, indicadorToCreate, aFormula,
	aVariable, anHistorico, aMapa } = require('../../utils/factories');
const { app, server } = require('../../../app');
const { generateToken } = require('../../middlewares/auth');


describe('v1/indicadores', function () {
	const SUB_ID = 1;
	const validToken = generateToken({ sub: SUB_ID });
	const validIndicador = indicadorToCreate();
	const statusActive = { activo: 'SI' };
	const adminRol = { rolValue: 'ADMIN' };
	const userRol = { rolValue: 'USER' };

	this.afterAll(function () {
		server.close();
	});

	this.afterEach(function () {
		sinon.restore();
	})

	describe.only('Public routes for /indicadores', function () {

		let findOneIndicador;
		let findAllIndicadores;
		this.beforeEach(function () {
			findOneIndicador = sinon.stub(Indicador, 'findOne');
			findAllIndicadores = sinon.stub(Indicador, 'findAll');
		});

		describe('GET /indicadores/:idIndicador', function () {
			this.beforeEach(function () {
				stubExistsMiddleware(findOneIndicador, { exists: true });
				stubPrevAndNextIndicadores(findAllIndicadores);
			});

			it('Should fail to return indicador because is INACTIVO', function (done) {
				stubGetOneIndicador(findOneIndicador, { indicador: getInactiveIndicadorWithTema() });

				chai.request(app)
					.get('/api/v1/indicadores/1')
					.end((_, res) => {
						expect(res).to.have.status(409);
						expect(findOneIndicador.calledTwice).to.be.true;
						expect(findAllIndicadores.calledOnce).to.be.true;
						done();
					})
			})

			it('Should fail to return indicador because its tema is INACTIVO', function (done) {
				stubGetOneIndicador(findOneIndicador, { indicador: getIndicadorWithInactiveTema() });

				chai.request(app)
					.get('/api/v1/indicadores/1')
					.end((_, res) => {
						expect(res).to.have.status(409);
						expect(findOneIndicador.calledTwice).to.be.true;
						expect(findAllIndicadores.calledOnce).to.be.true;
						done();
					})
			})

			it('Should fail to return an indicador because it does not exist', function (done) {
				stubExistsMiddleware(findOneIndicador, { exists: false });

				chai.request(app)
					.get('/api/v1/indicadores/1')
					.end((_, res) => {
						expect(res).to.have.status(404);
						expect(findOneIndicador.calledOnce).to.be.true;
						done()
					})
			});

			it('Should return status code 422 if :idIndicador is invalid', function (done) {
				chai.request(app)
					.get('/api/v1/indicadores/uno')
					.end((_, res) => {
						expect(res.error).to.not.be.null;
						expect(res).to.have.status(422);
						done();
					});
			});

			it('Should return an indicador', function (done) {
				stubGetOneIndicador(findOneIndicador, { indicador: getIndicadorWithTema() });

				chai.request(app)
					.get('/api/v1/indicadores/1')
					.end((_, res) => {
						expect(findOneIndicador.calledTwice).to.be.true;
						expect(findAllIndicadores.calledOnce).to.be.true;
						expect(res).to.have.status(200);
						done();
					});
			});
		})

		// describe('GET /indicadores/:id/usuarios')
		// describe('GET /indicadores/:id/catalogos')
		// describe('GET /indicadores/:id/mapa')
		// describe('GET /indicadores/:id/historicos')
	})

	describe.skip('Protected routes for /indicadores', function () {
		let findOneUsuario;

		this.beforeEach(function () {
			findOneUsuario = sinon.stub(Usuario, 'findOne')
		});

		describe('Actions that can be done ONLY by users with ADMIN role', function () {
			this.beforeAll(function () {
				sinon.restore()
				findOneUsuario = sinon.stub(Usuario, 'findOne')
				stubVerifyUserStatus(findOneUsuario, { isActive: true })
				stubVerifyUserRol(findOneUsuario, { roles: ['ADMIN'] })
			})

		})

		describe('Actions that can be done by users with USER and ADMIN roles', function () {
			this.beforeAll(function () {
				sinon.restore()
				findOneUsuario = sinon.stub(Usuario, 'findOne')
				stubVerifyUserStatus(findOneUsuario, { isActive: true })
				stubVerifyUserRol(findOneUsuario, { roles: ['USER'] })
			});

			describe('POST /indicadores', function () {
				it('Should create an indicador successfully', function (done) {
					const toCreate = indicadorToCreate();
					const createFake = sinon.fake.resolves(toCreate)
					sinon.replace(Indicador, 'create', createFake);
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(toCreate)
						.end(function (err, res) {
							expect(findOneUsuario.calledTwice).to.be.true;
							expect(createFake.calledOnce).to.be.true;
							expect(res.body.data).to.not.be.undefined;
							expect(res).to.have.status(201);
							expect(res.body.data).to.not.be.empty;
							done();
						});
				});

				it('Should create an indicador with formula and variables', function (done) {
					const toCreate = indicadorToCreate();
					const formula = aFormula(1);
					formula.variables = [aVariable(), aVariable()];
					toCreate.formula = formula;
					const createFake = sinon.fake.resolves(anIndicador(1));
					sinon.replace(Indicador, 'create', createFake);
					const bulkCreateRelations = sinon.fake.resolves(true);
					sinon.replace(UsuarioIndicador, 'bulkCreate', bulkCreateRelations)
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(toCreate)
						.end(function (err, res) {
							expect(findOneUsuario.calledTwice).to.be.true;
							expect(bulkCreateRelations.calledOnce).to.be.true;
							expect(err).to.be.null;
							expect(res).to.have.status(201);
							done()
						});
				});

				it('Should fail to create an indicador with formula and variables', function (done) {
					const indicador = indicadorToCreate();
					const formula = aFormula(1);
					const badVariable = aVariable();
					badVariable.dato = 'not a number';
					formula.variables = [badVariable];
					indicador.formula = formula;
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(indicador)
						.end(function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(422);
							expect(res.body.errors).to.be.an('array');
							done()
						});
				});

				it('Should create an indicador with historicos', function (done) {
					const toCreate = indicadorToCreate();
					toCreate.historicos = [anHistorico()];
					const createFake = sinon.fake.resolves(anIndicador(1));
					sinon.replace(Indicador, 'create', createFake);
					const bulkCreateRelations = sinon.fake.resolves(true);
					sinon.replace(UsuarioIndicador, 'bulkCreate', bulkCreateRelations)
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(toCreate)
						.end(function (err, res) {
							expect(findOneUsuario.calledTwice).to.be.true;
							expect(bulkCreateRelations.calledOnce, 'relation').to.be.true;
							expect(err).to.be.null;
							expect(res).to.have.status(201);
							expect(createFake.calledOnce).to.be.true;
							done()
						});
				});

				it('Should fail to create an indicador with bad formatted historicos', function (done) {
					const toCreate = indicadorToCreate();
					const badHistorico = anHistorico();
					badHistorico.anio = 'not a year';
					badHistorico.valor = 'not a number';
					toCreate.historicos = [badHistorico];
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(toCreate)
						.end(function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(422);
							expect(res.body.errors).to.be.an('array').with.lengthOf(2);
							done()
						});
				});

				it('Should create an indicador with a mapa', function (done) {
					const toCreate = indicadorToCreate();
					toCreate.mapa = aMapa();
					const createFake = sinon.fake.resolves(anIndicador(1));
					sinon.replace(Indicador, 'create', createFake);
					const bulkCreateRelations = sinon.fake.resolves(true);
					sinon.replace(UsuarioIndicador, 'bulkCreate', bulkCreateRelations)
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(toCreate)
						.end(function (err, res) {
							expect(findOneUsuario.calledTwice).to.be.true;
							expect(bulkCreateRelations.calledOnce, 'relation').to.be.true;
							expect(err).to.be.null;
							expect(res).to.have.status(201);
							expect(createFake.calledOnce).to.be.true;
							done()
						});
				});

				it('Should fail to create an indicador with a bad formatted mapa', function (done) {
					const toCreate = indicadorToCreate();
					const badMapa = aMapa();
					badMapa.url = 'not a url pattern';
					toCreate.mapa = badMapa;
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(toCreate)
						.end(function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(422);
							expect(res.body.errors).to.be.an('array').with.lengthOf(1);
							done()
						});
				});

				it('Should fail to create indicador due to semantic errors', function (done) {
					const { codigo, invalidIndicador } = indicadorToCreate();
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(invalidIndicador)
						.end(function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(422);
							expect(findOneUsuario.calledOnce).to.be.false;
							expect(res.body.errors).to.be.an('Array').that.is.not.empty;
							done();
						});

				});

				it('Should not create indicador because req does not have JWT', function (done) {
					chai.request(app)
						.post('/api/v1/indicadores')
						.send(validIndicador)
						.end(function (err, res) {
							expect(res).to.have.status(401);
							expect(findOneUsuario.calledTwice).to.be.false;
							done();
						});
				});

				it('Should not create indicador because token expired', function (done) {
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: 'Bearer valid' })
						.send(validIndicador)
						.end(function (err, res) {
							expect(findOneUsuario.calledOnce).to.be.false;
							expect(res).to.have.status(403)
							done()
						});
				});

				it('Should not create indicador because user has no permission', function (done) {
					sinon.restore();
					const accessRolUserFake = sinon.fake.resolves({ dataValues: { roles: 'NOT VALID' } });
					sinon.replace(Usuario, 'findOne', accessRolUserFake);
					chai.request(app)
						.post('/api/v1/indicadores')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(validIndicador)
						.end(function (err, res) {
							expect(accessRolUserFake.calledOnce).to.be.true;
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
							expect(findOneUsuario.calledTwice).to.be.true;
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
					chai.request(app)
						.patch('/api/v1/indicadores/1')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(validIndicador)
						.end(function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(204);
							expect(updateIndicadorFake.calledOnce).to.be.true;
							expect(findOneUsuario.calledTwice).to.be.true;
							done();
						})
				});

				it('Should update indicador successfully (user rol)', function (done) {
					const updateIndicadorFake = sinon.fake.resolves(1);
					sinon.replace(Indicador, 'update', updateIndicadorFake);

					chai.request(app)
						.patch('/api/v1/indicadores/1')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(validIndicador)
						.end(function (err, res) {
							expect(res).to.have.status(204);
							expect(updateIndicadorFake.calledOnce).to.be.true;
							expect(findOneUsuario.calledTwice).to.be.true;
							done();
						});
				});

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
					sinon.restore();
					const findOneIndicador = sinon.fake.resolves({ count: 1 })
					sinon.replace(Indicador, 'findOne', findOneIndicador);
					const findOneUsuarioFake = sinon.stub(Usuario, 'findOne');
					findOneUsuarioFake.onFirstCall().resolves(statusActive);
					findOneUsuarioFake.onSecondCall().resolves(userRol)
					const findOneUsuarioIndicadorFake = sinon.fake.resolves(0);
					sinon.replace(UsuarioIndicador, 'findOne', findOneUsuarioIndicadorFake);
					chai.request(app)
						.patch('/api/v1/indicadores/2')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(validIndicador)
						.end(function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(403);
							expect(findOneIndicador.calledOnce).to.be.true;
							expect(findOneUsuarioFake.calledTwice).to.be.true;
							expect(findOneUsuarioIndicadorFake.calledOnce).to.be.true;
							expect(res.error.text).to.be.equal('No tiene permiso para actualizar este indicador');
							done();
						});
				});

				it('Should not update because connection to DB fails', function (done) {
					const updateIndicadorFake = sinon.fake.rejects(new Error('Connection to DB failed'));
					sinon.replace(Indicador, 'update', updateIndicadorFake);

					chai.request(app)
						.patch('/api/v1/indicadores/1')
						.set({ Authorization: `Bearer ${validToken}` })
						.send(validIndicador)
						.end(function (err, res) {
							expect(res).to.have.status(500);
							expect(updateIndicadorFake.calledOnce).to.be.true;
							expect(findOneUsuario.calledTwice).to.be.true;
							done();
						});
				});
			});


			describe('GET /indicadores/:id/:resources', function () {
				describe('GET /indicadores/:id/formula', function () {
					it('Should return formula and variables of an indicador', function (done) {
						sinon.restore();
						const formulaWithVariables = { ...aFormula(1), variables: [aVariable(1), aVariable(2)] }
						const findOneFormula = sinon.fake.resolves({ dataValues: formulaWithVariables });
						sinon.replace(Formula, 'findOne', findOneFormula);

						const findOneIndicador = sinon.fake.resolves({ count: 1 });
						sinon.replace(Indicador, 'findOne', findOneIndicador)

						chai.request(app)
							.get('/api/v1/indicadores/1/formula')
							.set({ Authorization: `Bearer ${validToken}` })
							.end((err, res) => {
								expect(findOneFormula.calledOnce, 'formula').to.be.true;
								expect(findOneIndicador.calledOnce, 'indicador').to.be.true;
								expect(err).to.be.null;
								expect(res).to.have.status(200);
								expect(res.body.data).to.not.be.empty;
								expect(res.body.data.variables).to.be.an('array');
								expect(res.body.data.variables).to.have.length(2)
								expect(res.body.data.ecuacion).to.be.an('string');
								expect(res.body.data.descripcion).to.be.an('string');
								done();
							});
					})

					it('Should return no data because indicador does not have formula', function (done) {
						sinon.restore();
						const findOneFormula = sinon.fake.resolves(null);
						sinon.replace(Formula, 'findOne', findOneFormula);

						const findOneIndicador = sinon.fake.resolves({ count: 1 });
						sinon.replace(Indicador, 'findOne', findOneIndicador)

						chai.request(app)
							.get('/api/v1/indicadores/1/formula')
							.set({ Authorization: `Bearer ${validToken}` })
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body.data).to.be.an('object').and.be.empty;
								expect(findOneFormula.calledOnce).to.be.true;
								expect(findOneIndicador.calledOnce).to.be.true;
								done();
							})
					})
				})

				describe('GET /indicadores/:id/mapa', function () {
					it('Should return the mapa of an indicador', function (done) {
						sinon.restore();
						const findOneIndicador = sinon.fake.resolves({ count: 1 });
						sinon.replace(Indicador, 'findOne', findOneIndicador);

						const findOneMapa = sinon.fake.resolves(aMapa());
						sinon.replace(Mapa, 'findOne', findOneMapa);

						chai.request(app)
							.get('/api/v1/indicadores/1/mapa')
							.end((err, res) => {
								expect(err).to.be.null;
								expect(res).to.have.status(200);
								expect(res.body).to.not.be.empty;
								expect(findOneIndicador.calledOnce).to.be.true;
								expect(findOneMapa.calledOnce).to.be.true;
								done();
							})
					});

					it('Should return no data when getting mapa because indicador does not have one', function (done) {
						sinon.restore();
						const findOneIndicador = sinon.fake.resolves({ count: 1 });
						sinon.replace(Indicador, 'findOne', findOneIndicador);

						const findOneMapa = sinon.fake.resolves(null);
						sinon.replace(Mapa, 'findOne', findOneMapa);

						chai.request(app)
							.get('/api/v1/indicadores/1/mapa')
							.end((err, res) => {
								expect(err).to.be.null;
								expect(res).to.have.status(200);
								expect(res.body.data).to.be.empty;
								done();
							})
					});

					it('Should fail to get mapa because indicador does not exist', function (done) {
						sinon.restore();
						const findOneIndicador = sinon.fake.resolves({ count: 0 });
						sinon.replace(Indicador, 'findOne', findOneIndicador);

						chai.request(app)
							.get('/api/v1/indicadores/1/mapa')
							.end((err, res) => {
								expect(err).to.be.null;
								expect(res).to.have.status(404);
								done();
							})
					})
				})
			});



			describe('POST /indicadores/:id/:resources', function () {
				describe('POST /indicadores/:id/formula', function () {
					it('Should create formula for an Indicador', function (done) {
						const formula = aFormula(1);
						const createFake = sinon.fake.resolves(formula);
						sinon.replace(Formula, 'create', createFake);

						chai.request(app)
							.post('/api/v1/indicadores/1/formula')
							.set('Authorization', `Bearer ${validToken}`)
							.send(formula)
							.end((err, res) => {
								expect(err).to.be.null;
								expect(res).to.have.status(201)
								expect(createFake.calledOnce).to.be.true;
								done();
							})
					});

					it('Should create formula with variables for an Indicador', function (done) {
						const formulaWithVariables = { ...aFormula(), variables: [aVariable(1), aVariable(2)] }
						const createFake = sinon.fake.resolves(formulaWithVariables);
						sinon.replace(Formula, 'create', createFake);
						chai.request(app)
							.post('/api/v1/indicadores/1/formula')
							.set('Authorization', `Bearer ${validToken}`)
							.send(formulaWithVariables)
							.end((err, res) => {
								expect(err).to.be.null;
								expect(res).to.have.status(201)
								expect(createFake.calledOnce).to.be.true;
								done();
							})
					});

					it('Should fail to create formula because indicador does not exist', function (done) {
						sinon.restore();
						const findOneIndicador = sinon.fake.resolves({ count: 0 });
						sinon.replace(Indicador, 'findOne', findOneIndicador)

						const formulaWithVariables = { ...aFormula(), variables: [aVariable(1)] }

						chai.request(app)
							.post('/api/v1/indicadores/1/formula')
							.set('Authorization', `Bearer ${validToken}`)
							.send(formulaWithVariables)
							.end((err, res) => {
								expect(err).to.be.null;
								expect(res).to.have.status(404)
								expect(findOneIndicador.calledOnce).to.be.true;
								done();
							})
					})
				})

				describe('POST /indicadores/:id/mapa', () => {
					const mapa = aMapa();

					it('Should create a mapa for an indicador', done => {
						const createFakeMapa = sinon.fake.resolves({ dataValues: mapa })
						sinon.replace(Mapa, 'create', createFakeMapa);
						chai.request(app)
							.post('/api/v1/indicadores/1/mapa')
							.set('Authorization', `Bearer ${validToken}`)
							.type('form')
							.field('ubicacion', mapa.ubicacion)
							.field('url', mapa.url)
							.attach('urlImagen', Buffer.alloc(500_000), 'image.jpg')
							.end((err, res) => {
								expect(res).to.have.status(201);
								expect(createFakeMapa.calledOnce).to.be.true;
								done();
							})
					});

					it('Should fail because JWT is not present', done => {
						chai.request(app)
							.post('/api/v1/indicadores/1/mapa')
							.type('form')
							.field('ubicacion', mapa.ubicacion)
							.end((err, res) => {
								expect(res).to.have.status(401);
								done();
							})
					});

					it('Should fail because user is not assigned to the indicador', done => {
						sinon.restore();
						let findOneUsuario;
						findOneUsuario = sinon.stub(Usuario, 'findOne')
						findOneUsuario.onFirstCall().resolves(statusActive);
						findOneUsuario.onSecondCall().resolves(userRol);

						const findOneIndicador = sinon.fake.resolves({ count: 1 });
						sinon.replace(Indicador, 'findOne', findOneIndicador);

						const findOneRelation = sinon.fake.resolves({ count: 0 });
						sinon.replace(UsuarioIndicador, 'findOne', findOneRelation);

						chai.request(app)
							.post('/api/v1/indicadores/1/mapa')
							.set('Authorization', `Bearer ${validToken}`)
							.type('form')
							.field('ubicacion', mapa.ubicacion)
							.field('url', mapa.url)
							.attach('urlImagen', Buffer.alloc(500_000), 'image.jpg')
							.end((err, res) => {
								expect(res).to.have.status(403);
								expect(findOneUsuario.calledTwice).to.be.true;
								expect(findOneIndicador.calledOnce).to.be.true;
								expect(findOneRelation.calledOnce).to.be.true;
								done();
							})
					});

					it('Should fail because indicador does not exist', done => {
						sinon.restore();
						let findOneUsuario;
						findOneUsuario = sinon.stub(Usuario, 'findOne')
						findOneUsuario.onFirstCall().resolves(statusActive);
						findOneUsuario.onSecondCall().resolves(adminRol);

						const findOneIndicadorFake = sinon.fake.resolves({ count: 0 });
						sinon.replace(Indicador, 'findOne', findOneIndicadorFake);

						chai.request(app)
							.post('/api/v1/indicadores/1/mapa')
							.set('Authorization', `Bearer ${validToken}`)
							.type('form')
							.field('ubicacion', mapa.ubicacion)
							.field('url', mapa.url)
							.attach('urlImagen', Buffer.alloc(500_000), 'image.jpg')
							.end((err, res) => {
								expect(res).to.have.status(404)
								expect(findOneUsuario.calledTwice).to.be.true;
								expect(findOneIndicadorFake.calledOnce, 'find one indicador fake').to.be.true;
								done();
							})

					});

					it('Should fail because request body has validation errors', done => {
						chai.request(app)
							.post('/api/v1/indicadores/1/mapa')
							.set('Authorization', `Bearer ${validToken}`)
							.type('form')
							.field('ubicacion', mapa.ubicacion)
							.field('url', 'not a URL pattern')
							.attach('urlImagen', Buffer.alloc(1_000_000), 'image.jpg')
							.end((err, res) => {
								expect(res).to.have.status(422)
								done();
							})
					});
				})
			})

		})
	})

});


const stubExistsMiddleware = (stub, options) => {
	let exists = options?.exists;
	if (!options) {
		exists = true;
	}
	stub.onCall(0).resolves({ count: exists ? 1 : 0 });
	return stub;
}

const stubGetOneIndicador = (stub, options) => {
	const indicador = options?.indicador || anIndicador();
	stub.onCall(1).resolves(indicador);
}

const stubPrevAndNextIndicadores = (stub, options) => {
	const prev = options?.prev || { id: 2 };
	const next = options?.next || { id: 4 };
	stub.onCall(0).resolves([prev, next])
	return stub;
}

const stubVerifyUserStatus = (stub, options) => {
	let isActive = options?.isActive;
	if (!options) {
		isActive = true;
	}
	stub.onCall(0).resolves(isActive ? 'SI' : 'NO');
	return stub;
}

const stubVerifyUserRol = (stub, options) => {
	const roles = options?.roles || [];
	stub.onCall(1).resolves(roles)
}

const getIndicadorWithTema = () => {
	const temaInteres = aModulo(1);
	temaInteres.activo = 'SI';
	const indicador = anIndicador(1, temaInteres)
	indicador.activo = 'SI'
	return indicador;
}

const getInactiveIndicadorWithTema = () => {
	const temaInteres = aModulo(1);
	temaInteres.activo = 'SI';
	const indicador = anIndicador(1, temaInteres)
	indicador.activo = 'NO'
	return indicador;
}

const getIndicadorWithInactiveTema = () => {
	const temaInteres = aModulo(1)
	temaInteres.activo = 'NO'
	const indicador = anIndicador(1, { temaInteres })
	indicador.activo = 'SI'
	return indicador;
}