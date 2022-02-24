// const chai = require('chai');
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// const sinon = require('sinon');
// const { app, server } = require('../../../app');
// const { Rol, Usuario } = require('../../models');
// const { aRol, aUser } = require('../../utils/factories');
// const expect = chai.expect;
// const jwt = require('jsonwebtoken');
// const faker = require('faker');
// const { create } = require('combined-stream');
// require('dotenv').config();
// const { TOKEN_SECRET } = process.env;

// describe('v1/usuarios', function () {
//   let token;
//   const adminRol = { dataValues: { rol: 'ADMIN' } };
//   const userRol = { dataValues: { rol: 'USER' } };

//   this.beforeAll(function () {
//     token = jwt.sign({ sub: 100 }, TOKEN_SECRET, { expiresIn: '5h' });
//   });

//   this.afterEach(function () {
//     sinon.restore();
//   });

//   this.afterAll(function () {
//     server.close();
//   });


//   it('Should return a user if current user is admin', function (done) {
//     const findOneFake = sinon.stub(Usuario, 'findOne');
//     findOneFake.onFirstCall().resolves(adminRol);
//     findOneFake.onSecondCall().resolves(aUser(1));
//     chai.request(app)
//       .get('/api/v1/usuarios/1')
//       .set({ Authorization: `Bearer ${token}` })
//       .end((err, res) => {
//         expect(findOneFake.calledTwice).to.be.true;
//         expect(res).have.status(200);
//         expect(res.body).have.be.a("object");
//         done();
//       });
//   });

//   it('Should return not content if user is not found', function (done) {
//     const findOneFake = sinon.stub(Usuario, 'findOne');
//     findOneFake.onFirstCall().resolves(adminRol);
//     findOneFake.onSecondCall().resolves(null);
//     chai.request(app)
//       .get('/api/v1/usuarios/1')
//       .set({ Authorization: `Bearer ${token}` })
//       .end((err, res) => {
//         expect(findOneFake.calledTwice).to.be.true;
//         expect(res).have.status(204);
//         expect(res.body).have.be.a("object");
//         done();
//       });
//   });

//   it('Should not to return a user because call to db fails', function (done) {
//     const findOneFake = sinon.stub(Usuario, 'findOne');
//     findOneFake.onFirstCall().resolves(adminRol);
//     findOneFake.onSecondCall().rejects(new Error('Failed to connect to DB'));
//     chai.request(app)
//       .get('/api/v1/usuarios/1')
//       .set({ Authorization: `Bearer ${token}` })
//       .end((err, res) => {
//         expect(findOneFake.calledTwice).to.be.true;
//         expect(res).have.status(500);
//         done();
//       });
//   });

//   it('Should create a user', function (done) {
//     const userFake = aUser(1);
//     const findOneFake = sinon.stub(Usuario, 'findOne');
//     findOneFake.onFirstCall().resolves(adminRol);
//     findOneFake.onSecondCall().resolves(null);
//     const createUserFake = sinon.fake.resolves(userFake)
//     sinon.replace(Usuario, 'create', createUserFake)
//     chai.request(app)
//       .post('/api/v1/usuarios')
//       .set({ Authorization: `Bearer ${token}` })
//       .send(userFake)
//       .end((err, res) => {
//         expect(findOneFake.calledTwice).to.be.true;
//         expect(createUserFake.calledOnce).to.be.true;
//         expect(res).have.status(201);
//         done();
//       });
//   });

//   it('Should not create a user because email is not available', function (done) {
//     const userFake = aUser(10);
//     const findOneFake = sinon.stub(Usuario, 'findOne');
//     findOneFake.onFirstCall().resolves(adminRol);
//     findOneFake.onSecondCall().resolves(faker.internet.email());
//     chai.request(app)
//       .post('/api/v1/usuarios')
//       .set({ Authorization: `Bearer ${token}` })
//       .send(userFake)
//       .end((err, res) => {
//         expect(findOneFake.calledTwice).to.be.true;
//         expect(res).have.status(403);
//         done();
//       });
//   });

//   it('Should not create a user because connection to DB failed', function (done) {
//     const userFake = aUser(10);
//     const findOneFake = sinon.stub(Usuario, 'findOne');
//     findOneFake.onFirstCall().resolves(adminRol);
//     findOneFake.onSecondCall().resolves(null);
//     const createFake = sinon.fake.rejects(new Error('Connection failed'));
//     sinon.replace(Usuario, 'create', createFake);
//     chai.request(app)
//       .post('/api/v1/usuarios')
//       .set({ Authorization: `Bearer ${token}` })
//       .send(userFake)
//       .end((err, res) => {
//         expect(findOneFake.callCount).to.be.equal(2)
//         expect(createFake.calledOnce).to.be.true;
//         expect(res).have.status(500);
//         done();
//       });
//   });


//   it('Should edit a user', function (done) {
//     const userFake = aUser(1);
//     const editUserFake = sinon.fake.resolves(1)
//     sinon.replace(Usuario, 'update', editUserFake);
//     const findOneFake = sinon.stub(Usuario, 'findOne');
//     findOneFake.onFirstCall().resolves(adminRol);

//     chai.request(app)
//       .patch('/api/v1/usuarios/1')
//       .set({ Authorization: `Bearer ${token}` })
//       .send(userFake)
//       .end((err, res) => {
//         expect(editUserFake.calledOnce).to.be.true;
//         expect(findOneFake.calledOnce).to.be.true;
//         expect(res).have.status(204);
//         done();
//       });
//   });

//   it('Should not edit a user due to bad request', function (done) {
//     const userFake = aUser(1);
//     userFake.apellidoMaterno = 1;
//     chai.request(app)
//       .patch('/api/v1/usuarios/1')
//       .send(userFake)
//       .set({ Authorization: `Bearer ${token}` })
//       .end((err, res) => {
//         expect(res).have.status(422);
//         done();
//       });
//   });

//   it('Should not edit a user because connection to db fails', function (done) {
//     const userFake = aUser(1);
//     const editUserFake = sinon.fake.rejects(true)
//     sinon.replace(Usuario, 'update', editUserFake)
//     const findOneFake = sinon.fake.resolves(adminRol);
//     sinon.replace(Usuario, 'findOne', findOneFake);
//     chai.request(app)
//       .patch('/api/v1/usuarios/1')
//       .set({ Authorization: `Bearer ${token}` })
//       .send(userFake)
//       .end((err, res) => {
//         expect(editUserFake.calledOnce).to.be.true;
//         expect(findOneFake.calledOnce).to.be.true;
//         expect(res).have.status(500);
//         done();
//       });
//   });

//   it('Should return a list of users', function (done) {
//     const findAndCountAllFake = sinon.fake.resolves({ rows: [aUser(1)], count: 1 });
//     sinon.replace(Usuario, 'findAndCountAll', findAndCountAllFake);
//     const findOneFake = sinon.fake.resolves(adminRol);
//     sinon.replace(Usuario, 'findOne', findOneFake);
//     chai.request(app)
//       .get('/api/v1/usuarios')
//       .set({ Authorization: `Bearer ${token}` })
//       .end((err, res) => {
//         expect(res).have.status(200);
//         expect(findAndCountAllFake.calledOnce).to.be.true;
//         expect(findOneFake.calledOnce).to.be.true;
//         expect(res.body.data).to.be.an('array');
//         expect(res.body.data).to.have.lengthOf(1)
//         done();
//       });
//   });

//   it('Should not return a list of users', function (done) {
//     const findAndCountAllFake = sinon.fake.rejects(new Error('Connection to DB failed'));
//     sinon.replace(Usuario, 'findAndCountAll', findAndCountAllFake);
//     const findOneFake = sinon.fake.resolves(adminRol);
//     sinon.replace(Usuario, 'findOne', findOneFake);
//     chai.request(app)
//       .get('/api/v1/usuarios')
//       .set({ Authorization: `Bearer ${token}` })
//       .end((err, res) => {
//         expect(findAndCountAllFake.calledOnce).to.be.true;
//         expect(findOneFake.calledOnce).to.be.true;
//         expect(res).have.status(500);
//         done();
//       });
//   });

// });