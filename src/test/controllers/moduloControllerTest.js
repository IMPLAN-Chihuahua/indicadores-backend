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
})