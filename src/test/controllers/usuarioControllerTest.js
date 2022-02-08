const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const { app, server } = require('../../../app');
const { Rol } = require('../../models');
const { aRol } = require('../../utils/factories');
const expect = chai.expect;


describe('v1/usuarios', function () {


    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });


    it('Should return a list of users', function () {
        return chai.request(app)
            .get('/api/v1/usuarios')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.be.an('array');
            })
    });

});