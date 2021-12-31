const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('api/v1/modulos', function () {
    const baseUrl = 'http://localhost:8080/api/v1';

    describe('GET', function () {
        it('Should return a list of modules', function () {
            chai.request(baseUrl)
                .get('/modulos')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                });
        });
    });
})