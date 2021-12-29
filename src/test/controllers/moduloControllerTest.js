const chai = require('chai');
const chaiHttp = require('chai-http');
const { Modulo } = require('../../models/modulo');
const faker = require('faker');
const expect = chai.expect;
chai.use(chaiHttp);


describe('api/v1/modulos', function () {
    const baseUrl = 'http://localhost:8080/api/v1';
    const modulo = {
        temaIndicador: faker.name.title(),
        codigo: '001',
        observaciones: faker.lorem.words(10)
    };

    this.beforeAll(async function () {
        await Modulo.create(modulo);
    });

    this.afterAll(async function () {
        await Modulo.truncate({ cascade: true });
    });

    describe('GET', function () {
        it('Should return a list of modules', function (done) {
            chai.request(baseUrl)
                .get('/modulos')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.lengthOf.at.least(1);
                    done();
                });
        });
    });
})