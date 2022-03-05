const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const { app, server } = require('../../../app');
const { Usuario } = require('../../models');
const { aUser } = require('../../utils/factories');
const expect = chai.expect;
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { TOKEN_SECRET } = process.env;
const { anIndicador } = require('../../utils/factories');


describe('v1/me', function () {
  const token = jwt.sign({ sub: 1 }, TOKEN_SECRET, { expiresIn: '5h' });

  this.afterEach(function () {
    sinon.restore();
  });

  this.afterAll(function () {
    server.close();
  });

  this.beforeAll(function () {
    indicadoresFromUser = [
      anIndicador(1),
      anIndicador(1),
      anIndicador(1),
      anIndicador(1),
      anIndicador(1)
    ];
  });

  describe('/', function () {
    it('Should return the profile information of a user with a token', function (done) {
      const findOneFake = sinon.fake.resolves(aUser(1));
      sinon.replace(Usuario, 'findOne', findOneFake);
      chai.request(app)
        .get('/api/v1/me')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(findOneFake.calledOnce).to.be.true;
          expect(res.body.data).to.not.be.empty;
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


  // describe('me/indicadores', function () {
  //   it('Should return a list of indicadores based on a user', function (done) {
  //     const findOneFake = sinon.fake.resolves({
  //       dataValues: {
  //         indicadores: indicadoresFromUser
  //       }
  //     });
  //     sinon.replace(Usuario, 'findOne', findOneFake);
  //     chai.request(app)
  //       .get('/api/v1/me/indicadores')
  //       .set({ Authorization: `Bearer ${token}` })
  //       .end((err, res) => {
  //         expect(res).to.have.status(200);
  //         expect(findOneFake.calledOnce).to.be.true;
  //         expect(res.body.total).to.be.equal(indicadoresFromUser.length);
  //         expect(res.body.data).to.be.an('array');
  //         done();
  //       });
  //   });

  //   it('Should not return a list of indicadores based on a user because of token expiration', function (done) {
  //     chai.request(app)
  //       .get('/api/v1/me/indicadores')
  //       .set({ Authorization: `Bearer expired` })
  //       .end((err, res) => {
  //         expect(res).to.have.status(403);
  //         done();
  //       });
  //   });

  //   it('Should not return a list of indicadores based on a user because of token is not present', function (done) {
  //     chai.request(app)
  //       .get('/api/v1/me/indicadores')
  //       .end((err, res) => {
  //         expect(res).to.have.status(401);
  //         done();
  //       });
  //   });
  // });

});