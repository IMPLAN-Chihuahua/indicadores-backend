const chai = require('chai');
const chaiHttp = require('chai-http')
chai.use(chaiHttp);
const expect = chai.expect;
const { app, server } = require('../../../app');
const { Modulo } = require('../../models');
const sinon = require('sinon');
const { aModulo } = require('../../utils/factories');
const ModuloService = require('../../services/moduloService');
const faker = require('faker');

describe('Modulo service', function() {
    afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    describe('Read operations', function() {
        const modulos = [aModulo(1), aModulo(2), aModulo(3)];
        it('Should return a list of modulos and the total number of them', function() {
            const findAndCountAllFake = sinon.fake.resolves({rows: modulos, count: modulos.length});
            sinon.replace(Modulo, 'findAndCountAll', findAndCountAllFake);
            const countFake = sinon.fake.resolves(modulos.length);
            sinon.replace(Modulo, 'count', countFake);
            return ModuloService.getAllModulos(1, 3, { temaIndicador: 'lorem'})
                .then(res => {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(res.modulos).to.be.an('array').that.is.not.empty;
                    expect(res.total).to.equal(modulos.length);
                })
        });

        it('Should return an error if getAllModulos fails to retrieve data', function() {
            const findAndCountAllFake = sinon.fake.rejects(new Error());
            sinon.replace(Modulo, 'findAndCountAll', findAndCountAllFake);
            return ModuloService.getAllModulos(1, 3, { temaIndicador: 'lorem'})
                .then(res => {
                    expect(res).to.be.null;
                })
                .catch(err => {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(err).to.not.be.null;
                });
        })

        it('Should return the count of inactive modulos', function() {
            const countInactiveFake = sinon.fake.resolves(modulos.length);
            sinon.replace(Modulo, 'count', countInactiveFake);
            return ModuloService.countModulos()
                .then(res => {
                    expect(countInactiveFake.calledOnce).to.be.true;
                    expect(res).to.equal(modulos.length);
                });
        });

        it('Should fail to retrieve the count of inactive modulos', function() {
            const countInactiveFake = sinon.fake.rejects(new Error());
            sinon.replace(Modulo, 'count', countInactiveFake);
            return ModuloService.countModulos()
                .then(res => {
                    expect(res).to.be.null;
                })
                .catch(err => {
                    expect(countInactiveFake.calledOnce).to.be.true;
                    expect(err).to.not.be.null;
                });
        });
        
    })

    describe('Create operations', function () {
        it('Should create a new modulo and show its data', function() {
            const moduloFake = aModulo(1);
            const createOneFake = sinon.fake.resolves(moduloFake);
            sinon.replace(Modulo, 'create', createOneFake);
            const createdModulo = ModuloService.addModulo(moduloFake);
            expect(createOneFake.calledOnce).to.be.true;
            expect(createdModulo).is.not.null;
        });

        it('Should return true if temaIndicador already exists', function() {
            const findOneFake = sinon.fake.resolves(aModulo(1));
            sinon.replace(Modulo, 'findOne', findOneFake);
            return ModuloService.isTemaIndicadorAlreadyInUse(aModulo(1).temaIndicador)
                .then(res => {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.be.true;
                });
        });

        it('Should return false if temaIndicador does not exist', function() {
            const findOneFake = sinon.fake.resolves(null);
            sinon.replace(Modulo, 'findOne', findOneFake);
            return ModuloService.isTemaIndicadorAlreadyInUse(aModulo(1).temaIndicador)
                .then(res => {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.be.false;
                });
        });

        it('Should not create a modulo because of internal error', function() {
            const createOneFake = sinon.fake.throws('Error');
            sinon.replace(Modulo, 'create', createOneFake);
            return ModuloService.addModulo(aModulo(1))
                .catch(err => {
                    expect(createOneFake.calledOnce).to.be.true;
                    expect(err).to.be.an('error');
                });
        })
    });

    describe('Update operations', function() {
        it('Should update a modulo\'s temaIndicador', function() {
            const updateModulo = faker.random.word();
            const updateFake = sinon.fake.resolves(1);
            sinon.replace(Modulo, 'update', updateFake);
            return ModuloService.updateModulo(aModulo(1).id, { temaIndicador: updateModulo })
                .then(res => {
                    expect(updateFake.calledOnce).to.be.true;
                    expect(res).to.be.true;
                });
        });

        it('Should update an entire modulo', function() {
            const updateModulo = aModulo(2);
            const updateFake = sinon.fake.resolves(1);
            sinon.replace(Modulo, 'update', updateFake);
            return ModuloService.updateModulo(aModulo(1).id, updateModulo)
                .then(res => {
                    expect(updateFake.calledOnce).to.be.true;
                    expect(res).to.be.true;
                });
        });

        it('Should not update a modulo due to internal error', function() {
            const updateFake = sinon.fake.throws('Error');
            sinon.replace(Modulo, 'update', updateFake);
            return ModuloService.updateModulo(aModulo(1).id, aModulo(1))
                .catch(err => {
                    expect(updateFake.calledOnce).to.be.true;
                    expect(err).to.be.an('error');
                });
        });

        it('Should update a modulo status', function() {
            const findOneFake = sinon.fake.resolves(aModulo(1));
            const updateFake = sinon.fake.resolves(1);
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Modulo, 'update', updateFake);
            return ModuloService.updateModuloStatus(aModulo(1).id, { status: 'inactive' })
                .then(res => {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(updateFake.calledOnce).to.be.true;
                    expect(res).to.be.true;
                }
            );
        });

        it('Should not update a modulo status due to internal error', function() {
            const findOneFake = sinon.fake.resolves(aModulo(1));
            const updateFake = sinon.fake.throws('Error');
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Modulo, 'update', updateFake);
            return ModuloService.updateModuloStatus(aModulo(1).id, { status: 'inactive' })
                .catch(err => {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(updateFake.calledOnce).to.be.true;
                    expect(err).to.be.an('error');
                });
        });
    });

});