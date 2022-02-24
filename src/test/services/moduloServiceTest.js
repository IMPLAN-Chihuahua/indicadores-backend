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
        })
    });

});