const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('api/v1/modulos/:idModulo/indicadores', function () {

    const activeFilter = {
        anioUltimoValorDisponible: 2019
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
                .get('/modulos/13131313131/indicadores')
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
                    expect(res.body.total_pages).to.be.at.least(1);
                    expect(res.body.data).to.have.lengthOf.above(1);
                    done();
                });

        });

        it('should return a list of filtered items', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ ...activeFilter, page: 1, per_page: 2 })
                .end(function (err, res) {
                    expect(activeFilter).is.not.empty;
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.total_pages).to.be.at.least(1);
                    expect(res.body.data).to.have.length.within(0, 2);
                    expect(res.body.data[0].anioUltimoValorDisponible)
                        .to.be.equals(activeFilter.anioUltimoValorDisponible);
                    done();
                });
        });

        it('should return a list with a negative tendency', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ tendenciaActual: 'DESCENDENTE' })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.data[0].tendenciaActual).to.be.equals('DESCENDENTE');
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

        it('should return not found if :idModulo does not exist', function (done) {
            chai.request(baseUrl)
                .get('/modulos/101010/indicadores/1')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(err).to.be.null;
                    done();
                })
        });

        it('should return a list of indicadores filtered by idOds (1)', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ idOds: 1 })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.data[0].Ods.id).to.be.equal(1);
                    done();
                });
        });

        it('Should return not found if indicadores is filtered by an unexisting idOds ', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ idOds: 13131313131 })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.empty;
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should return not found if indicadores is filtered by an unexisting idOds ', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ idOds: 'undefinedId' })
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should return a list of ordered indicadores by name', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ sort_by: 'nombre', order: 'asc' })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const length = res.body.data[0].nombre.localeCompare(res.body.data[1].nombre);
                    expect(length).to.be.equals(-1);
                    done();
                });
        });
        
        it('Should return not found if sort by or order is undefined', function (done) {
            chai.request(baseUrl)
                .get('/modulos/1/indicadores')
                .query({ sort_by: 'attribute', order: 'quantum' })
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    expect(err).to.be.null;
                    done();
                });
        })
    });
});