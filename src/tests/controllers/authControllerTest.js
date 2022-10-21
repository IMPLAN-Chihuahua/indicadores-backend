const { expect } = require("chai");
const { describe } = require("mocha");
const chai = require("chai");
const { app } = require("../../../app");
const chaiHttp = require("chai-http");
const { Usuario } = require("../../models");
const bcrypt = require("bcrypt");
const { aUser } = require("../../utils/factories");
chai.use(chaiHttp);
const sinon = require("sinon");

describe("v1/auth", function () {

  this.afterEach(function () {
    sinon.restore();
  });

  it("Should return user if credentials are valid", function (done) {
    const findOneFake = sinon.fake.resolves(aUser(1));
    sinon.replace(Usuario, "findOne", findOneFake);

    const compareFake = sinon.fake.resolves(true);
    sinon.replace(bcrypt, "compare", compareFake);

    chai.request(app)
      .post("/api/v1/auth/login")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(findOneFake.calledOnce).to.be.true;
        expect(compareFake.calledOnce).to.be.true;
        done();
      });
  });

  it("Should fail if user does not exist", function (done) {
    const findOneFake = sinon.fake.resolves(null);
    sinon.replace(Usuario, "findOne", findOneFake);

    chai.request(app)
      .post("/api/v1/auth/login")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res.body.message).equal('Credenciales invalidas')
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(findOneFake.calledOnce).to.be.true;
        expect()
        done();
      });
  });

  it("Should fail if password is not valid", function (done) {
    const findOneFake = sinon.fake.resolves(aUser(1));
    sinon.replace(Usuario, "findOne", findOneFake);

    const compareFake = sinon.fake.resolves(false);
    sinon.replace(bcrypt, "compare", compareFake);

    chai.request(app)
      .post("/api/v1/auth/login")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res.body.message).equal('Credenciales invalidas');
        expect(res).to.have.status(401);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(findOneFake.calledOnce).to.be.true;
        expect(compareFake.calledOnce).to.be.true;
        done();
      });
  });


  it("Should fail if user is disable", function (done) {
    const findOneFake = sinon.fake.resolves({ ...aUser(1), activo: 'NO' });
    sinon.replace(Usuario, "findOne", findOneFake);

    const compareFake = sinon.fake.resolves(true);
    sinon.replace(bcrypt, "compare", compareFake);

    chai.request(app)
      .post("/api/v1/auth/login")
      .send({ correo: "johndoe@email.com", clave: "password" })
      .end(function (err, res) {
        expect(res).to.have.status(403);
        expect(res.body.message).equal('La cuenta se encuentra deshabilitada');
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(findOneFake.calledOnce).to.be.true;
        expect(compareFake.calledOnce).to.be.true;
        done();
      });

  });

});
