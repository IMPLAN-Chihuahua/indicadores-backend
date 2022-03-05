const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const { app, server } = require('../../../app');
const { Ods, CoberturaGeografica, UnidadMedida } = require('../../models');
const sinon = require('sinon');
const { aDummyWithName } = require('../../utils/factories');

describe('/catalogos', function () {

    let dummyList;
    this.beforeAll(function () {
        dummyList = [aDummyWithName(1), aDummyWithName(2), aDummyWithName(3)];
    })
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
    })
});