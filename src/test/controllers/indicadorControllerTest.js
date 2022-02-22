const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const { Indicador } = require('../../models');
const { Modulo } = require('../../models');
const { app, server } = require('../../../app');
const sinon = require('sinon');
const { anIndicador, aModulo } = require('../../utils/factories');

describe('v1/indicadores', function () {

    const activeFilter = {
        anioUltimoValorDisponible: 2019
    };

    let indicadoresList = [];
    const dummyModulo = aModulo(1);
    const dummyIndicador = anIndicador(1);

    this.beforeAll(function () {
        indicadoresList = [
            anIndicador(1),
            anIndicador(2),
            anIndicador(3),
            anIndicador(4),
            anIndicador(5)
        ];
    });


    this.afterAll(function () {
        server.close();
    });

    describe('GET /indicadores', function () {

        this.afterEach(function () {
            sinon.restore();
        })

        it('Should return indicadores of :idModulo', function (done) {
            const findOneFake = sinon.fake.resolves(aModulo)
            const findAndCountAllFake = sinon.fake.resolves(
                { rows: indicadoresList, count: indicadoresList.length });
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    done();
                });
        });


        it('Should return status code 404 if :idModulo does not exist', function (done) {
            const findOneFake = sinon.fake.resolves(null);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res.error).to.exist;
                    expect(res).to.have.status(404);
                    done()
                });
        });

        it('Should return status code 422 with invalid :idModulo', function (done) {
            chai.request(app)
                .get('/api/v1/modulos/notvalid/indicadores')
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    done();
                })
        });

        it('Should return 2 items per page', function (done) {
            const findAndCountAllFake = sinon.fake.resolves({ rows: indicadoresList, count: indicadoresList.length });
            const findOneFake = sinon.fake.resolves(dummyModulo);
            const perPage = 5;
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ per_page: perPage })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.total_pages).to.be.at.least(1);
                    expect(res.body.data).to.have.lengthOf(perPage);
                    done();
                });

        });

        it('Should return a list of filtered items', function (done) {
            indicadoresList[0].anioUltimoValorDisponible = 2019;
            indicadoresList[1].anioUltimoValorDisponible = 2019;
            const rows = [indicadoresList[0], indicadoresList[1]];
            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake)
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ anioUltimoValorDisponible: 2019, page: 1, per_page: 2 })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(activeFilter).is.not.empty;
                    expect(res).to.have.status(200);
                    expect(res.body.total_pages).to.be.at.least(1);
                    expect(res.body.data).to.have.length.within(0, 2);
                    expect(res.body.data[0].anioUltimoValorDisponible).to.be.equals(2019);
                    done();
                });
        });

        it('Should return a list with a negative tendency', function (done) {
            indicadoresList[0].tendenciaActual = 'DESCENDENTE';
            indicadoresList[1].tendenciaActual = 'DESCENDENTE';
            const rows = [indicadoresList[0], indicadoresList[1]];
            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake)
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ tendenciaActual: 'DESCENDENTE' })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    expect(res.body.data[0].tendenciaActual).to.be.equals('DESCENDENTE');
                    done();
                });
        });

        it('Should return an individual item', function (done) {
            const findOneFake = sinon.fake.resolves(dummyIndicador);
            sinon.replace(Indicador, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/indicadores/1')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data.id).to.equal(dummyIndicador.id);
                    expect(res.body.data.nombre).to.equal(dummyIndicador.nombre);
                    expect(res.body.data.codigo).to.equal(dummyIndicador.codigo);
                    done();
                });
        });

        it('Should return a list of items', function(done) {
            chai.request(app)
                .get('/api/v1/indicadores')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    expect(res.body.data[0].id).to.be.a('number');
                    expect(res.body.data[0].nombre).to.be.a('string');
                    done();
                });
        });

        it('Should return status code 422 if :idIndicador is invalid', function (done) {
            chai.request(app)
                .get('/api/v1/indicadores/uno')
                .end(function (err, res) {
                    expect(res.error).to.not.be.null;
                    expect(res).to.have.status(422);
                    done();
                });
        });

        it('Should return not found if :idModulo does not exist', function (done) {
            const findOneFake = sinon.fake.resolves(null);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .end(function (err, res) {
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(404);
                    done();
                })
        });

        it('Should return a list of indicadores filtered by idOds', function (done) {
            indicadoresList[0].idOds = 1;
            indicadoresList[1].idOds = 1;
            const rows = [indicadoresList[0], indicadoresList[1]];

            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);

            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);

            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ idOds: 1 })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data[0].idOds).to.be.equal(1);
                    done();
                });
        });

        it('Should return an empty data array if indicadores is filtered by an unexisting idOds ', function (done) {
            const findAndCountAllFake = sinon.fake.resolves({ rows: [], count: 0 });
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);

            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);

            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ idOds: 1 })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.empty;
                    done();
                });
        });

        it('Should not process request if indicadores is filtered by an invalid idOds', function (done) {
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ idOds: 'undefinedId' })
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    done();
                });
        });

        it('Should return a list of ordered indicadores by name', function (done) {
            indicadoresList[0].nombre = 'A';
            indicadoresList[1].nombre = 'B';
            const rows = [indicadoresList[0], indicadoresList[1]];

            const findAndCountAllFake = sinon.fake.resolves({ rows, count: rows.length });
            sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);

            const findOneFake = sinon.fake.resolves(dummyModulo);
            sinon.replace(Modulo, 'findOne', findOneFake);

            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ sort_by: 'nombre', order: 'asc' })
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(findOneFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    const comparison = res.body.data[0].nombre.localeCompare(res.body.data[1].nombre);
                    expect(comparison).to.be.equals(-1);
                    done();
                });
        });


        it('Should return not found if sort by or order is undefined', function (done) {
            chai.request(app)
                .get('/api/v1/modulos/1/indicadores')
                .query({ sort_by: 'invalid', order: 'invalid' })
                .end(function (err, res) {
                    expect(res).to.have.status(422);
                    done();
                });
        })

    });
});

describe('v1/documentos', function () {
    const dummyIndicador = anIndicador(1);
    this.afterAll(function () {
        server.close();
    });

    this.afterEach(function () {
        sinon.restore();
    });

    it('Should return an excel document', function (done) {
        const findOneFake = sinon.fake.resolves(dummyIndicador);
        sinon.replace(Indicador, 'findOne', findOneFake);
        chai.request(app)
            .get('/api/v1/documentos/1/xlsx')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.header['content-type']).to.be.equal('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                expect(res.header['content-disposition']).to.have.string('attachment');
                expect(res.header['connection']).to.be.equal('close');
                done();
            });
    });

    it('Should not return an excel document', function (done) {
        const findOneFake = sinon.fake.rejects(dummyIndicador);
        sinon.replace(Indicador, 'findOne', findOneFake);
        chai.request(app)
            .get('/api/v1/documentos/1/xlsx')
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Should return a csv document', function (done) {
        const findOneFake = sinon.fake.resolves(dummyIndicador);
        sinon.replace(Indicador, 'findOne', findOneFake);
        chai.request(app)
            .get('/api/v1/documentos/1/csv')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.header['content-type']).to.be.equal('text/csv; charset=utf-8');
                expect(res.header['content-disposition']).to.have.string('attachment');
                expect(res.header['connection']).to.be.equal('close');
                done();
            });
    });

    it('Should not return a csv document', function (done) {
        const findOneFake = sinon.fake.rejects(dummyIndicador);
        sinon.replace(Indicador, 'findOne', findOneFake);
        chai.request(app)
            .get('/api/v1/documentos/1/csv')
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Should return a json document', function (done) {
        const findOneFake = sinon.fake.resolves(dummyIndicador);
        sinon.replace(Indicador, 'findOne', findOneFake);
        chai.request(app)
            .get('/api/v1/documentos/1/json')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.header['content-type']).to.be.equal('application/json; charset=utf-8');
                expect(res.header['content-disposition']).to.have.string('attachment');
                expect(res.header['connection']).to.be.equal('close');
                done();
            });
    });

    it('Should not return a json document', function (done) {
        const findOneFake = sinon.fake.rejects(dummyIndicador);
        sinon.replace(Indicador, 'findOne', findOneFake);
        chai.request(app)
            .get('/api/v1/documentos/1/json')
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

   it('Should return 422 because of typo error', function (done) {
        const findOneFake = sinon.fake.resolves(dummyIndicador);
        sinon.replace(Indicador, 'findOne', findOneFake);
        chai.request(app)
            .get('/api/v1/documentos/1/xslx')
            .end(function (err, res) {
                expect(res).to.have.status(422);
                done();
            });
    });

})