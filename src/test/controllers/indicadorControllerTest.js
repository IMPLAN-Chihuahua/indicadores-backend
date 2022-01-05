const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('api/v1/modulos/:idModulo/indicadores', function () {

    const activeFilter = {
        nombre: 'test'
    };

    const baseUrl = 'http://localhost:8080/api/v1';

    describe('GET', function () {
        it('should return indicadores of :idModulo', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    done();
                });
        });

        it('should return status code 404 if :idModulo does not exist', function (done) {
            chai.request(baseUrl)
                .get('/modulos/0/indicadores')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(err).to.be.null;
                    done()
                });
        });

        it('should return status code 422 with invalid :idModulo', function (done) {
            chai.request(baseUrl)
                .get('/modulos/s/indicadores')
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    expect(err).to.be.null;
                    done();
                })
        });

        it('should return 2 items per page', function (done) {
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

        it('should return a list of filtered items', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ ...activeFilter, page: 1, per_page: 2 })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.total_pages).to.be.at.least(1);
                    expect(res.body.data).to.have.length.within(0, 2);
                    done();
                });
        });

        it('should return an individual item', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores/1')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.data.nombre).to.be.not.empty;
                    done();
                });
        });

        it('should return status code 422 if unprocessable entity', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores/uno')
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    expect(err).to.be.null;
                    done();
                });
        });

    });
});