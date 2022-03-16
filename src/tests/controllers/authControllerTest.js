const { expect } = require("chai");
const { describe } = require("mocha");
const chai = require("chai");
const { app, server } = require("../../../app");
const chaiHttp = require("chai-http");
const { Usuario } = require("../../models");
const bcrypt = require("bcrypt");
const { aUser } = require("../../utils/factories");
chai.use(chaiHttp);
const sinon = require("sinon");

describe.only("auth controller", function () {

  this.afterEach(function () {
    sinon.restore();
  });

  it("Should success if credential is valid", function (done) {
    const findOneFake = sinon.fake.resolves(aUser(1));
    const compareFake = sinon.fake.resolves(true);

    sinon.replace(Usuario, "findOne", findOneFake);
    sinon.replace(bcrypt, "compare", compareFake);
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        done();
      });
  });

  it("Should fail if user does not exist", function (done) {
    const findOneFake = sinon.fake.resolves(null);
    const compareFake = sinon.fake.resolves(true);

    sinon.replace(Usuario, "findOne", findOneFake);
    sinon.replace(bcrypt, "compare", compareFake);
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res.body.message).equal('Credenciales invalidas')
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        done();
      });
  });
  
  it("Should fail if password is not valid", function (done) {
    const findOneFake = sinon.fake.resolves(aUser(1));
    const compareFake = sinon.fake.resolves(false);

    sinon.replace(Usuario, "findOne", findOneFake);
    sinon.replace(bcrypt, "compare", compareFake);
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res.body.message).equal('Credenciales invalidas')
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        done();
      });
});


it("Should fail if user is disable", function (done) {
    const findOneFakeDisable = sinon.fake.resolves({...aUser(1), activo:'NO'});
    const compareFake = sinon.fake.resolves(true);
    sinon.replace(Usuario, "findOne", findOneFakeDisable);
    sinon.replace(bcrypt, "compare", compareFake);
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res.body.message).equal('La cuenta se encuentra deshabilitada')
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        done();
      });

});

  it("Should fail", function (done) {
    const findOneFakeDisable = sinon.fake.rejects(new Error('NA'));
    const compareFake = sinon.fake.resolves(true);
    sinon.replace(Usuario, "findOne", findOneFakeDisable);
    sinon.replace(bcrypt, "compare", compareFake);
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res).to.have.status(500);
        done();
      });

  });

  it.only('Should generate an user token for password recovery', function(done) {
    const findOneFake = sinon.fake.resolves(aUser(1));
    const updateOneFake = sinon.fake.resolves(aUser(1));
    
    sinon.replace(Usuario, "findOne", findOneFake);
    sinon.replace(Usuario, "update", updateOneFake);
    this.timeout(1000000);
    chai
      .request(app)
      .get("/api/v1/auth/password-reset")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ correo: "mailer@mail.com" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        done();
      });
  });

});
