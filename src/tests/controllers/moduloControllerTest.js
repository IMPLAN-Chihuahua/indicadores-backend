/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
const chai = require('chai');
const chaiHttp = require('chai-http')
const sinon = require('sinon');
require('dotenv').config();

chai.use(chaiHttp);
const { expect } = chai;
const { app, server } = require('../../../app');
const { Modulo, Usuario } = require('../../models');
const { aModulo, aUser } = require('../../utils/factories');
const fileUpload = require('../../middlewares/fileUpload');
const { generateToken } = require('../../middlewares/auth');


describe('/modulos', function () {
  const token = generateToken({ sub: 1 });
  const statusActive = { activo: 'SI' };

  const adminRol = { rolValue: 'ADMIN' };
  const userRol = { roles: 'USER' };

  describe('GET', function () {
    const modulosFake = [aModulo(1), aModulo(2), aModulo(3)];

    afterEach(function () {
      sinon.restore();
    });

    this.afterAll(function () {
      server.close();
    });

    it('Should return a list of Modulos', function (done) {
      const findAllFake = sinon.fake.resolves(modulosFake);
      const countFake = sinon.fake.resolves(modulosFake.length);

      sinon.replace(Modulo, 'count', countFake);
      sinon.replace(Modulo, 'findAll', findAllFake);
      chai.request(app)
        .get('/api/v1/modulos')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(findAllFake.calledOnce).to.be.true;
          expect(res.body.data).to.have.lengthOf(modulosFake.length);
          done();
        })
    });

    it('Should return a list of Modulos with pagination', function (done) {
      const findAndCountAllFake = sinon.fake.resolves({ rows: modulosFake, count: modulosFake.length });
      const countFake = sinon.fake.resolves(modulosFake.length);
      const findOneFake = sinon.fake.resolves(aUser(1));

      sinon.replace(Usuario, 'findOne', findOneFake);
      sinon.replace(Modulo, 'count', countFake);
      sinon.replace(Modulo, 'findAndCountAll', findAndCountAllFake);
      chai.request(app)
        .get('/api/v1/me/modulos')
        .set('Authorization', `Bearer ${token}`)
        .end(function (err, res) {
          expect(findAndCountAllFake.calledOnce).to.be.true;
          expect(countFake.calledOnce).to.be.true;
          expect(findOneFake.calledOnce).to.be.true;
          expect(res).to.have.status(200);
          done();
        })
    })

    it('Should return status 500 if any error is found', function (done) {
      const findAllFake = sinon.fake.rejects(new Error('Testing error'));
      sinon.replace(Modulo, 'findAll', findAllFake);
      chai.request(app)
        .get('/api/v1/modulos')
        .end(function (err, res) {
          expect(findAllFake.calledOnce).to.be.true;
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe('GET /:idModulo', function () {
    afterEach(function () {
      sinon.restore();
    });

    this.afterAll(function () {
      server.close();
    });

    it('Should return a modulo', function (done) {
      const dummyModulo = aModulo(1);
      dummyModulo.activo = 'SI'
      const findByPkFake = sinon.fake.resolves(dummyModulo)
      sinon.replace(Modulo, 'findByPk', findByPkFake);
      chai.request(app)
        .get('/api/v1/modulos/1')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data).to.exist;
          expect(res.body.data.id).to.be.a('number');
          expect(res.body.data.temaIndicador).to.exist;
          expect(res.body.data.observaciones).to.exist;
          expect(res.body.data.activo).to.be.an('string');
          expect(res.body.data.urlImagen).to.exist;
          expect(res.body.data.color).to.exist
          expect(findByPkFake.calledOnce).to.be.true;
          done();
        });
    })

    it('Should fail to return a modulo due to an invalid id', function (done) {
      chai.request(app)
        .get('/api/v1/modulos/notvalid')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body.errors).to.be.an('array').that.is.not.empty;
          done();
        })
    })

    it('Should return not found if modulo does not exist', function (done) {
      const findByPkFake = sinon.fake.resolves(null);
      sinon.replace(Modulo, 'findByPk', findByPkFake);
      chai.request(app)
        .get('/api/v1/modulos/1000')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(findByPkFake.calledOnce).to.be.true;
          done();
        });
    });

    it('Should return conflict error if modulo is not active', function (done) {
      const inactiveModulo = aModulo(20);
      inactiveModulo.activo = 'NO';
      const findByPkFake = sinon.fake.resolves(inactiveModulo);
      sinon.replace(Modulo, 'findByPk', findByPkFake);
      chai.request(app)
        .get('/api/v1/modulos/20')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(409);
          done();
        })
    })
  });

  describe('POST /modulos', function () {

    this.afterEach(function () {
      sinon.restore();
    });

    let usuarioStub;

    this.beforeEach(function () {
      usuarioStub = sinon.stub(Usuario, 'findOne');
      usuarioStub.onFirstCall().resolves(statusActive);
      usuarioStub.onSecondCall().resolves(adminRol);
    });

    const bigImage = Buffer.alloc(2_200_000, '.jpg')
    const allowedImage = Buffer.alloc(10_000, '.jpg')
    const notAllowedFile = Buffer.alloc(50, '.pdf')

    it('Should reject the creation of a new modulo due to file size limit exceeded', function (done) {
      const moduloFake = aModulo(5);
      const createModuloFake = sinon.fake.resolves(moduloFake);
      const findOneFake = sinon.fake.resolves(null);

      const fileUploadFake = sinon.fake.resolves({
        filename: 'bigImage.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: () => bigImage
      });

      sinon.replace(fileUpload, 'uploadImage', fileUploadFake);
      sinon.replace(Modulo, 'create', createModuloFake);
      sinon.replace(Modulo, 'findOne', findOneFake);
      chai.request(app)
        .post('/api/v1/modulos')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .field('temaIndicador', moduloFake.temaIndicador)
        .field('id', moduloFake.id)
        .field('codigo', moduloFake.codigo)
        .field('activo', moduloFake.activo)
        .field('observaciones', moduloFake.observaciones)
        .field('color', moduloFake.color)
        .attach('urlImagen', bigImage, 'bigImage.jpg')
        .end(function (err, res) {
          expect(res).to.have.status(413);
          done();
        });
    });

    it('Should reject the creation of a new modulo due to not allowed file type', function (done) {
      const moduloFake = aModulo(5);
      const createModuloFake = sinon.fake.resolves(moduloFake);
      const findOneFake = sinon.fake.resolves(null);
      sinon.replace(Modulo, 'create', createModuloFake);
      sinon.replace(Modulo, 'findOne', findOneFake);
      chai.request(app)
        .post('/api/v1/modulos')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .field('temaIndicador', moduloFake.temaIndicador)
        .field('id', moduloFake.id)
        .field('codigo', moduloFake.codigo)
        .field('activo', moduloFake.activo)
        .field('observaciones', moduloFake.observaciones)
        .field('color', moduloFake.color)
        .attach('urlImagen', notAllowedFile, 'samplePDF.pdf')
        .end(function (err, res) {
          expect(res).to.have.status(422);
          done();
        });
    });

    it('Should create a new modulo with an image', function (done) {
      const moduloFake = aModulo(5).dataValues;
      const createModuloFake = sinon.fake.resolves(moduloFake);
      sinon.replace(Modulo, 'create', createModuloFake);

      const findOneFake = sinon.fake.resolves(null);
      sinon.replace(Modulo, 'findOne', findOneFake);

      const fileUploadFake = sinon.fake.resolves({
        filename: 'allowedImage.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: () => allowedImage
      });
      sinon.replace(fileUpload, 'uploadImage', fileUploadFake);

      chai.request(app)
        .post('/api/v1/modulos')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .field('temaIndicador', moduloFake.temaIndicador)
        .field('codigo', moduloFake.codigo)
        .field('activo', moduloFake.activo)
        .field('observaciones', moduloFake.observaciones)
        .field('color', moduloFake.color)
        .field('descripcion', moduloFake.descripcion)
        .attach('urlImagen', allowedImage, 'avatar.jpg')
        .end(function (err, res) {
          expect(err).to.be.null
          expect(createModuloFake.calledOnce, 'called create fake').to.be.true;
          expect(usuarioStub.calledTwice).to.be.true;
          expect(res).to.have.status(201);
          expect(res.body.data).to.have.property('temaIndicador');
          expect(res.body.data).to.have.property('codigo');
          expect(res.body.data).to.have.property('activo');
          expect(res.body.data).to.have.property('observaciones');
          expect(res.body.data).to.have.property('color');
          expect(res.body.data).to.have.property('descripcion');
          expect(res.body.data).to.have.property('urlImagen');
          done();
        });
    });

    it('Should create a new modulo', function (done) {
      const moduloFake = aModulo(1).dataValues;
      const createModuloFake = sinon.fake.resolves(moduloFake);
      sinon.replace(Modulo, 'create', createModuloFake);

      const findOneFake = sinon.fake.resolves(null);
      sinon.replace(Modulo, 'findOne', findOneFake);

      chai.request(app)
        .post('/api/v1/modulos')
        .set({ Authorization: `Bearer ${token}` })
        .send({ ...moduloFake })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(usuarioStub.calledTwice).to.be.true;
          expect(createModuloFake.calledOnce).to.be.true;
          expect(findOneFake.calledOnce).to.be.true;
          done();
        });
    });

    it('Should not create a new modulo because tema is already in use', function (done) {
      const moduloFake = aModulo(1).dataValues;
      const findOneFake = sinon.fake.resolves(false);
      sinon.replace(Modulo, 'findOne', findOneFake);
      chai.request(app)
        .post('/api/v1/modulos')
        .set({ Authorization: `Bearer ${token}` })
        .send({ ...moduloFake })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(usuarioStub.calledTwice).to.be.true;
          expect(findOneFake.calledOnce).to.be.true;
          expect(res).to.have.status(409);
          expect(res.body.message).to.be.equal(`El tema indicador ${moduloFake.temaIndicador} ya está en uso`)
          done();
        });
    });

    it('Should not create a new modulo due to wrong codigo attribute', function (done) {
      const moduloFake = { ...aModulo(1), codigo: '1' };
      const createModuloFake = sinon.fake.resolves(moduloFake);
      const findOneFake = sinon.fake.resolves(true);
      sinon.replace(Modulo, 'create', createModuloFake);
      sinon.replace(Modulo, 'findOne', findOneFake);
      chai.request(app)
        .post('/api/v1/modulos')
        .set({ Authorization: `Bearer ${token}` })
        .send(moduloFake)
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    })

    it('Should not create a new modulo due to internal error', function (done) {
      const moduloFake = aModulo(1).dataValues;
      const createModuloFake = sinon.fake.throws('Error');
      sinon.replace(Modulo, 'create', createModuloFake);
      const findOneFake = sinon.fake.rejects(null);
      sinon.replace(Modulo, 'findOne', findOneFake);

      chai.request(app)
        .post('/api/v1/modulos')
        .set({ Authorization: `Bearer ${token}` })
        .send(moduloFake)
        .end((err, res) => {
          expect(usuarioStub.calledTwice, 'usuario stub').to.be.true;
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Should restrict a module creation due to invalid token', function (done) {
      const createModuloFake = sinon.fake.rejects(aModulo(1));
      const findOneFake = sinon.fake.resolves(null);
      sinon.replace(Modulo, 'create', createModuloFake);
      sinon.replace(Modulo, 'findOne', findOneFake);
      chai.request(app)
        .post('/api/v1/modulos')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    })

  });

  describe('PUT /:idModulo', function () {
    let usuarioStub;
    this.beforeEach(function () {
      usuarioStub = sinon.stub(Usuario, 'findOne');
      usuarioStub.onFirstCall().resolves(statusActive);
      usuarioStub.onSecondCall().resolves(adminRol);
    });

    this.afterEach(function () {
      sinon.restore();
    });

    this.afterAll(function () {
      server.close();
    });

    it('Should edit a modulo', function (done) {
      const moduloFake = aModulo(1);
      const editModuloFake = sinon.fake.resolves(true);
      sinon.replace(Modulo, 'update', editModuloFake);
      chai.request(app)
        .put('/api/v1/modulos/1')
        .set({ Authorization: `Bearer ${token}` })
        .send(moduloFake)
        .end((err, res) => {
          expect(res).to.have.status(204);
          expect(res.body.data).to.not.be.null;
          done();
        });
    });

    it('Should not edit a modulo -bad request', function (done) {
      const moduloFake = aModulo(1);
      const editModuloFake = sinon.fake.resolves(moduloFake);
      sinon.replace(Modulo, 'update', editModuloFake);

      chai.request(app)
        .put('/api/v1/modulos/1')
        .send(moduloFake)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('Should not edit a modulo due to internal errors', function (done) {
      const moduloFake = aModulo(1).dataValues;
      const editModuloFake = sinon.fake.rejects(new Error('Error'));
      sinon.replace(Modulo, 'update', editModuloFake);
      chai.request(app)
        .put('/api/v1/modulos/1')
        .set({ Authorization: `Bearer ${token}` })
        .send({ ...moduloFake })
        .end((err, res) => {
          expect(editModuloFake.calledOnce, 'update modulo').to.be.true;
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe('PATCH /:idModulo', function () {
    let usuarioStub;
    this.beforeEach(function () {
      usuarioStub = sinon.stub(Usuario, 'findOne');
      usuarioStub.onFirstCall().resolves(statusActive);
      usuarioStub.onSecondCall().resolves(adminRol);
    });

    this.afterEach(function () {
      sinon.restore();
    });

    this.afterAll(function () {
      server.close();
    });

    it('Should edit a given modulo status', function (done) {
      const moduloFake = aModulo(1);
      const findOneFake = sinon.fake.resolves(moduloFake);
      const editOneFake = sinon.fake.resolves(true);
      sinon.replace(Modulo, 'findOne', findOneFake);
      sinon.replace(Modulo, 'update', editOneFake);
      chai.request(app)
        .patch('/api/v1/modulos/1')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(204);
          expect(res.body.data).to.not.be.null;
          done();
        });
    });

    it('Should not edit a given modulo status -bad request', function (done) {
      const moduloFake = aModulo(1);
      const findOneFake = sinon.fake.resolves(moduloFake);
      const editOneFake = sinon.fake.resolves(false);
      sinon.replace(Modulo, 'findOne', findOneFake);
      sinon.replace(Modulo, 'update', editOneFake);
      chai.request(app)
        .patch('/api/v1/modulos/1')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('Should not edit a given modulo status due to internal errors', function (done) {
      const moduloFake = aModulo(1);
      const findOneFake = sinon.fake.resolves(moduloFake);
      const editOneFake = sinon.fake.throws('Error');
      sinon.replace(Modulo, 'findOne', findOneFake);
      sinon.replace(Modulo, 'update', editOneFake);
      chai.request(app)
        .patch('/api/v1/modulos/1')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });
})