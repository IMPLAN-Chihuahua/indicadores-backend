const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const { app, server } = require('../../../app');
const { Rol, Usuario } = require('../../models');
const { aRol, aUser } = require('../../utils/factories');
const expect = chai.expect;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const SALT_ROUNDS = 10;
require('dotenv').config();
const { TOKEN_SECRET } = process.env;

describe('v1/me', function () {
  const token = jwt.sign({ sub: 1 }, TOKEN_SECRET, { expiresIn: '5h' });

  this.beforeEach(function () {
    sinon.restore();
  });

  this.afterAll(function () {
    server.close();
  });

  it('Should return the profile information of a user with a token', function (done) {
    const findOneFake = sinon.fake.resolves(aUser(1));
    sinon.replace(Usuario, 'findOne', findOneFake);
    chai.request(app)
      .get('/api/v1/me')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(findOneFake.calledOnce).to.be.true;
        expect(res.body).to.not.be.empty;
        done();
      });
  });

  it('Should not return the information of a user because token expired', function (done) {
    chai.request(app)
      .get('/api/v1/me')
      .set({ Authorization: 'Bearer notvalid' })
      .end((err, res) => {
        expect(res).to.have.status(403)
        done();
      });
  });

  it('Should return not authorized if token is not present', function (done) {
    chai.request(app)
      .get('/api/v1/me')
      .end((err, res) => {
        expect(res).to.have.status(401)
        done();
      });
  });

});