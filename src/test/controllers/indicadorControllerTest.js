const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('api/v1/modulos/:id/indicadores', function () {

    const baseUrl = 'http://localhost:8080/api/v1';

    describe('GET /indicadores', function () {
        it('should return status code 200', function () {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                });
        });

        it('should return status code 404 if modulo does not exist', function () {
            chai.request(baseUrl)
                .get('/modulos/0/indicadores')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(err).to.be.null
                })
        });

        //422
        it('should return status code 422', function () {
            chai.request(baseUrl)
                .get('/modulos/notvalid/indicadores')
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    expect(err).to.be.null
                })
        });

        it('should return 2 items per page', function (done) {
            // TODO: Seed agregar 5 indicadores a un modulo
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ page: 1, per_page: 2 })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.total_pages).to.be.equal(3);
                    expect(res.body.data).to.have.lengthOf(2);
                    done();
                });

        });
    });

});