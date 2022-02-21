const chai = require('chai');
const chaiHttp = require('chai-http')
chai.use(chaiHttp);
const expect = chai.expect;
const { app, server } = require('../../../app');
const { Modulo } = require('../../models');
const sinon = require('sinon');
const { aModulo } = require('../../utils/factories');



describe('/modulos', function () {

    describe('GET', function () {
        const modulosFake = [aModulo(1), aModulo(2), aModulo(3)];

        afterEach(function () {
            sinon.restore();
        });

        this.afterAll(function () {
            server.close();
        });

        it('Should return a list of Modulos', function (done) {
            const findAllFake = sinon.fake.resolves(modulosFake);
            sinon.replace(Modulo, 'findAll', findAllFake);
            chai.request(app)
                .get('/api/v1/modulos')
                .end(function (err, res) {
                    expect(findAllFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.lengthOf(modulosFake.length);
                    done();
                })
        });

        it('Should return status 500 if any error is found', function (done) {
            const findAllFake = sinon.fake.throws('Error');
            sinon.replace(Modulo, 'findAll', findAllFake);
            chai.request(app)
                .get('/api/v1/modulos')
                .end(function (err, res) {
                    expect(findAllFake.calledOnce).to.be.true;
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
    
    describe('POST', function () {
        
        this.afterEach(function () {
            sinon.restore();
        });

        this.afterAll(function () {
            server.close();
        });

       it('Should create a new modulo', function (done) {
            const moduloFake = aModulo(2);
            const createModuloFake = sinon.fake.resolves(moduloFake);
            const findOneFake = sinon.fake.resolves(null);
            sinon.replace(Modulo, 'create', createModuloFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .post('/api/v1/modulos/create')
                .send(moduloFake)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('temaIndicador', 'New value');
                    done();
                });
        });

       it('Should not create a new modulo due to repeated temaIndicador', function (done) {
            const moduloFake = aModulo(1);
            const createModuloFake = sinon.fake.resolves(moduloFake);
            const findOneFake = sinon.fake.resolves(false);
            sinon.replace(Modulo, 'create', createModuloFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .post('/api/v1/modulos/create')
                .send(moduloFake)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('Should not create a new modulo due to wrong temaIndicador attribute', function (done) {
            const moduloFake = {...aModulo(1), temaIndicador: ''};
            const createModuloFake = sinon.fake.resolves(moduloFake);
            const findOneFake = sinon.fake.resolves(true);
            sinon.replace(Modulo, 'create', createModuloFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .post('/api/v1/modulos/create')
                .send(moduloFake)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    done();
                });
        })

        it('Should not create a new modulo due to wrong codigo attribute', function (done) {
            const moduloFake = {...aModulo(1), codigo: '1'};
            const createModuloFake = sinon.fake.resolves(moduloFake);
            const findOneFake = sinon.fake.resolves(true);
            sinon.replace(Modulo, 'create', createModuloFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .post('/api/v1/modulos/create')
                .send(moduloFake)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    done();
                });
        })

        it('Should not create a new modulo due to internal error', function (done) {
            const moduloFake = aModulo(1);
            const createModuloFake = sinon.fake.throws('Error');
            const findOneFake = sinon.fake.rejects(null);
            sinon.replace(Modulo, 'create', createModuloFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .post('/api/v1/modulos/create')
                .send(moduloFake)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    done();
                });
        });

    });
})