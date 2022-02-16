const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const { app, server } = require('../../../app');
const { Rol, Usuario } = require('../../models');
const { aRol, aUser } = require('../../utils/factories');
const expect = chai.expect;

describe('v1/usuarios', function () {

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY0NDk0ODEwOCwiZXhwIjoxNjQ0OTY2MTA4fQ.rY3R0CKDtJrnQnkJ4Gu0meaVTr39f_kWTL42iV9a9so';
before(function(){
  getUser = sinon.stub(id, "value")
})


    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    it('Should return a user', function (done) {
      const findOneFake = sinon.fake.resolves(aUser(1))
      console.log(findOneFake)
      sinon.replace(Usuario,'findOne',findOneFake)
    chai
    .request(app)
    .get('/api/v1/usuarios/1')
    .set({ Authorization: `Bearer ${token}` })
    .end((err, res) => {
      expect(res).have.status(200);
      expect(res.body).have.be.a("object");
      done();
    });
  });


    it('Should return a list of users', function (done) {
        const findAndCountAllFake = sinon.fake.resolves({rows: [aUser(1)], count: 1})
        sinon.replace(Usuario,'findAndCountAll',findAndCountAllFake)
      chai
      .request(app)
      .get('/api/v1/usuarios')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res).have.status(200);
        expect(res.body).have.be.a("object");
        done();
      });
  });

  

});