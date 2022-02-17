const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const { app, server } = require('../../../app');
const { Rol, Usuario } = require('../../models');
const { aRol, aUser } = require('../../utils/factories');
const expect = chai.expect;
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;


describe('v1/usuarios', function () {

    let token = '8=D';

    this.beforeAll( function(done){
      const findOneFake = sinon.fake.resolves(aUser(1));
      const compareFake = sinon.fake.resolves(true);
  
      sinon.replace(Usuario, "findOne", findOneFake);
      sinon.replace(bcrypt, "compare", compareFake);
      chai
        .request(app)
        .post("/api/v1/login")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({ correo: "johndoe@email.com", clave: "password" })
        .end(function (err, res) {
          token = (res.body.token)
          expect(res).to.have.status(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.be.an("object");
          done();
        });
    })

    this.beforeEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });


  it('Should return a user', function (done) {
      const findOneFake = sinon.fake.resolves(aUser(1))
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

  it('Should return not content', function (done) {
    const findOneFake = sinon.fake.resolves(null)
    sinon.replace(Usuario,'findOne',findOneFake)
  chai
  .request(app)
  .get('/api/v1/usuarios/1')
  .set({ Authorization: `Bearer ${token}` })
  .end((err, res) => {
    expect(res).have.status(204);
    expect(res.body).have.be.a("object");
    done();
  });
});

  it('Should not to return a user', function (done) {
    const findOneFake = sinon.fake.rejects(aUser(1))
    sinon.replace(Usuario,'findOne',findOneFake)
  chai
  .request(app)
  .get('/api/v1/usuarios/1')
  .set({ Authorization: `Bearer ${token}` })
  .end((err, res) => {
    expect(res).have.status(500);
    done();
  });
});

  it('Should create a user', function (done) {
    const userFake = aUser(1);
    const createUserFake = sinon.fake.resolves(userFake)
    const isEmailAvailable = sinon.fake.resolves(true)
    sinon.replace(Usuario,'create',createUserFake)
    sinon.replace(Usuario,'findOne',isEmailAvailable)
    chai
    .request(app)
    .post('/api/v1/usuarios')
    .set({ Authorization: `Bearer ${token}` })
    .send(userFake)
    .end((err, res) => {
      expect(res).have.status(403);
      done();
  });
  });

  it('Should not create a user because email is not available', function (done) {
    const userFake = aUser(10);
    const createUserFake = sinon.fake.resolves(userFake)
    const isEmailAvailable = sinon.fake.resolves(false)
    sinon.replace(Usuario,'create',createUserFake)
    sinon.replace(Usuario,'findOne',isEmailAvailable)
    chai
    .request(app)
    .post('/api/v1/usuarios')
    .set({ Authorization: `Bearer ${token}` })
    .send(userFake)
    .end((err, res) => {
      expect(res).have.status(403);
      done();
  });
  });

  it('Should not create a user ', function (done) {
    const userFake = aUser(10);
    const createUserFake = sinon.fake.rejects(userFake)
    const isEmailAvailable = sinon.fake.rejects(false)
    sinon.replace(Usuario,'create',createUserFake)
    sinon.replace(Usuario,'findOne',isEmailAvailable)
    chai
    .request(app)
    .post('/api/v1/usuarios')
    .set({ Authorization: `Bearer ${token}` })
    .send(userFake)
    .end((err, res) => {
      console.log(res.body)
      expect(res).have.status(500);
      done();
  });
  });


  it('Should edit a user', function (done) {
    const userFake = aUser(1);
    
    const editUserFake = sinon.fake.resolves(true)
    sinon.replace(Usuario,'update',editUserFake)
    
    chai
    .request(app)
    .patch('/api/v1/usuarios/1')
    .set({ Authorization: `Bearer ${token}` })
    .send(userFake)
    .end((err, res) => {
      expect(res).have.status(204);
      done();
  });
  });

  it('Should not edit a user -bad request', function (done) {
    const userFake = aUser(1);
    
    const editUserFake = sinon.fake.resolves(userFake)
    sinon.replace(Usuario,'update',editUserFake)
    
    chai
    .request(app)
    .patch('/api/v1/usuarios/1')
    .send(userFake)
    .set({ Authorization: `Bearer ${token}` })
    .end((err, res) => {
      expect(res).have.status(400);
      done();
  });
  });

  it('Should not edit a user', function (done) {
    const userFake = aUser(1);
    
    const editUserFake = sinon.fake.rejects(true)
    sinon.replace(Usuario,'update',editUserFake)
    
    chai
    .request(app)
    .patch('/api/v1/usuarios/1')
    .set({ Authorization: `Bearer ${token}` })
    .send(userFake)
    .end((err, res) => {
      expect(res).have.status(500);
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
  it('Should not return a list of users', function (done) {
    const findAndCountAllFake = sinon.fake.rejects({rows: [aUser(1)], count: 1})
    sinon.replace(Usuario,'findAndCountAll',findAndCountAllFake)
  chai
  .request(app)
  .get('/api/v1/usuarios')
  .set({ Authorization: `Bearer ${token}` })
  .end((err, res) => {
    expect(res).have.status(500);
    done();
  });
});


  

});