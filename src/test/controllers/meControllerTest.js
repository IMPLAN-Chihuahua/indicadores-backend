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

const { Indicador } = require('../../models');
const { anIndicador, aModulo } = require('../../utils/factories');


describe('v1/me', function () {
  const token = jwt.sign({ sub: 1 }, TOKEN_SECRET, { expiresIn: '5h' });

  this.beforeEach(function () {
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

  describe('me/indicadores', function () {

    it('Should return a list of indicadores based on a user', function (done) {
      const findAndCountAllFakeIndicadores = sinon.fake.resolves({indicadores: indicadoresFromUser, total: indicadoresFromUser.length});
      sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFakeIndicadores);
      chai.request(app)
        .get('/api/v1/me/indicadores')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(findAndCountAllFakeIndicadores.calledOnce).to.be.true;
          expect(res.body.cantidadIndicadores).to.be.equal(indicadoresFromUser.length);
          done();
        });
    });

    it('Should not return a list of indicadores based on a user because of token expiration', function (done) {
      const findAndCountAllFakeIndicadores = sinon.fake.rejects({indicadores: indicadoresFromUser, total: indicadoresFromUser.length});
      sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFakeIndicadores);
      chai.request(app)
        .get('/api/v1/me/indicadores')
        .set({ Authorization: `Bearer notvalid` })
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    }); 
    
    it('Should not return a list of indicadores based on a user because of token is not present', function (done) {
      const findAndCountAllFakeIndicadores = sinon.fake.rejects({indicadores: indicadoresFromUser, total: indicadoresFromUser.length});
      sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFakeIndicadores);
      chai.request(app)
        .get('/api/v1/me/indicadores')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });   
    
  });

});