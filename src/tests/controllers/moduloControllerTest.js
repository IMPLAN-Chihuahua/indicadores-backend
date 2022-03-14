const chai = require('chai');
const chaiHttp = require('chai-http')
chai.use(chaiHttp);
const expect = chai.expect;
const { app, server } = require('../../../app');
const { Modulo } = require('../../models');
const sinon = require('sinon');
const { aModulo } = require('../../utils/factories');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const SALT_ROUNDS = 10;
require('dotenv').config();
const { TOKEN_SECRET } = process.env;

const fileUpload = require('../../middlewares/fileUpload');


describe('/modulos', function () {
    const token = jwt.sign({ sub: 1 }, TOKEN_SECRET, { expiresIn: '5h' });

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
                    expect(findAllFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.lengthOf(modulosFake.length);
                    done();
                })
        });

        it('Should return a list of Modulos with pagination and requiring authorization', function(done) {
            const findAndCountAllFake = sinon.fake.resolves({rows: modulosFake, count: modulosFake.length});
            const countFake = sinon.fake.resolves(modulosFake.length);
            sinon.replace(Modulo, 'count', countFake);
            sinon.replace(Modulo, 'findAndCountAll', findAndCountAllFake);
            chai.request(app)
                .get('/api/v1/me/modulos')
                .set('Authorization', `Bearer ${token}`)
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    done();
                })
        })
        
        it('Should return an error if getAllModulos fails to retrieve data', function(done) {
            const findAndCountAllFake = sinon.fake.throws('error');
            sinon.replace(Modulo, 'findAndCountAll', findAndCountAllFake);
            chai.request(app)
                .get('/api/v1/me/modulos')
                .set('Authorization', `Bearer ${token}`)
                .end(function (err, res) {
                    expect(findAndCountAllFake.calledOnce).to.be.true;
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it('Should return status 500 if any error is found', function (done) {
            const findAllFake = sinon.fake.throws('Error');
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
    
    describe('POST', function () {
        
        this.afterEach(function () {
            sinon.restore();
        });

        this.afterAll(function () {
            server.close();
        });

        const bigImage = Buffer.alloc(10000000, '.jpg')
        const allowedImage = Buffer.alloc(10000, '.jpg')
        const notAllowedFile = Buffer.alloc(10000, '.pdf')

        it('Should reject the creation of a new modulo due to file size limit exceeded', function(done) {
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
                .attach('urlImagen', bigImage , 'bigImage.jpg')
                .end(function (err, res) {
                    expect(res).to.have.status(413);
                    done();
                });
        });

        it('Should reject the creation of a new modulo due to not allowed file type', function(done) {
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

        it('Should create a new modulo with an image', function(done) {
            const moduloFake = aModulo(5);
            const createModuloFake = sinon.fake.resolves(moduloFake);
            const findOneFake = sinon.fake.resolves(null);

            const fileUploadFake = sinon.fake.resolves({
                filename: 'allowedImage.jpg',
                mimetype: 'image/jpeg',
                encoding: '7bit',
                createReadStream: () => allowedImage
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
                .attach('urlImagen', allowedImage, 'avatar.jpg')
                .end(function (err, res) {
                    expect(createModuloFake.calledOnce).to.be.true;
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('temaIndicador');
                    expect(res.body.data).to.have.property('codigo');
                    expect(res.body.data).to.have.property('activo');
                    expect(res.body.data).to.have.property('observaciones');
                    expect(res.body.data).to.have.property('color');
                    expect(res.body.data).to.have.property('urlImagen');
                    done();
                });
        });

        it('Should create a new modulo', function (done) {
                const moduloFake = aModulo(2);
                const createModuloFake = sinon.fake.resolves(moduloFake);
                const findOneFake = sinon.fake.resolves(null);
                sinon.replace(Modulo, 'create', createModuloFake);
                sinon.replace(Modulo, 'findOne', findOneFake);
                chai.request(app)
                    .post('/api/v1/modulos')
                    .set({ Authorization: `Bearer ${token}` })
                    .send(moduloFake)
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res.body.data).to.have.property('temaIndicador', 'New value');
                        done();
                    });
            });

        it('Should not create a new modulo due to repeated temaIndicador', function (done) {
            const moduloFake = aModulo(1);
            const createModuloFake = sinon.fake.resolves(moduloFake);
            const findOneFake = sinon.fake.resolves(false);
            sinon.replace(Modulo, 'create', createModuloFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .post('/api/v1/modulos')
                .set({ Authorization: `Bearer ${token}` })
                .send(moduloFake)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('Should not create a new modulo due to wrong temaIndicador attribute', function (done) {
            const moduloFake = {...aModulo(1), temaIndicador: ''};
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

        it('Should not create a new modulo due to wrong codigo attribute', function (done) {
            const moduloFake = {...aModulo(1), codigo: '1'};
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
            const moduloFake = aModulo(1);
            const createModuloFake = sinon.fake.throws('Error');
            const findOneFake = sinon.fake.rejects(null);
            sinon.replace(Modulo, 'create', createModuloFake);
            sinon.replace(Modulo, 'findOne', findOneFake);
            chai.request(app)
                .post('/api/v1/modulos')
                .set({ Authorization: `Bearer ${token}` })
                .send(moduloFake)
                .end((err, res) => {
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

    describe('PUT', function() {
        this.afterEach(function () {
            sinon.restore();
        });

        this.afterAll(function () {
            server.close();
        });

        it('Should edit a modulo', function(done) {
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

        it('Should not edit a modulo -bad request', function(done) {
            const moduloFake = aModulo(1);
            const editModuloFake = sinon.fake.resolves(moduloFake);
            sinon.replace(Modulo, 'update', editModuloFake);
            
            chai.request(app)
                .put('/api/v1/modulos/1')
                .send(moduloFake)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it('Should not edit a modulo due to internal errors', function(done) {
            const moduloFake = aModulo(1);
            const editModuloFake = sinon.fake.throws('Error');
            sinon.replace(Modulo, 'update', editModuloFake);
            chai.request(app)
                .put('/api/v1/modulos/1')
                .set({ Authorization: `Bearer ${token}` })
                .send(moduloFake)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    describe('PATCH', function() {
        this.afterEach(function () {
            sinon.restore();
        });

        this.afterAll(function () {
            server.close();
        });

        it('Should edit a given modulo status', function(done) {
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

        it('Should not edit a given modulo status -bad request', function(done) {
            const moduloFake = aModulo(1);
            const findOneFake = sinon.fake.resolves(moduloFake);
            const editOneFake = sinon.fake.resolves(false);
            sinon.replace(Modulo, 'findOne', findOneFake);
            sinon.replace(Modulo, 'update', editOneFake);
            chai.request(app)
                .patch('/api/v1/modulos/1')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it('Should not edit a given modulo status due to internal errors', function(done) {
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