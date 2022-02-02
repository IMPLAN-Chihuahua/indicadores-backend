const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const { app, server } = require('../../../app');
const { Rol } = require('../../models');
const { aRol } = require('../../utils/factories');
const expect = chai.expect;

describe('v1/roles', function () {
    let roles = [];

    this.beforeAll(function () {
        roles = [aRol(1), aRol(2), aRol(3)]
    });

    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });


    it('should get a list of roles', function (done) {
        sinon.replace(Rol, 'findAll', sinon.fake.resolves(roles));
        chai.request(app)
            .get('/api/v1/roles')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.data).to.be.an('array').that.is.not.empty;
                done()
            });
    });

});
