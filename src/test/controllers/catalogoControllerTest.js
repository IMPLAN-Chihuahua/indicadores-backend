const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('api/v1/modulos/:idModulo/indicadores', function () {

    const baseUrl = 'http://localhost:8080/api/v1';

    describe('GET', function () {
        it('should return catalog of ODS', function (done) {
            chai.request(baseUrl)
                .get('/ods')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });
});