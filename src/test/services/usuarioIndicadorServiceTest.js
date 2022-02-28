const chai = require('chai');
const expect = chai.expect;
const { UsuarioIndicador } = require('../../models');
const sinon = require('sinon');
const UsuarioIndicadorService = require('../../services/usuarioIndicadorService');
const { server } = require('../../../app');

describe('Usuario-Indicador service', function () {

  this.afterEach(function () {
    sinon.restore();
  });

  this.afterAll(function () {
    server.close();
  });

  describe('Read operations', function () {
    // it fails due to constraint errors

    it('Returns true if user has a relation with an indicador', function () {
      const findOneFake = sinon.fake.resolves({ dataValues: { count: 1 } });
      sinon.replace(UsuarioIndicador, 'findOne', findOneFake)
      return UsuarioIndicadorService.areConnected(1, 1)
        .then(res => {
          expect(res).to.be.true;
          expect(findOneFake.calledOnce).to.be.true;
        });
    });

    it('Should fail due to connection to DB failed', function () {
      const findOneFake = sinon.fake.rejects(new Error('Connection to DB failed'));
      sinon.replace(UsuarioIndicador, 'findOne', findOneFake);
      return UsuarioIndicadorService.areConnected(1, 1)
        .catch(err => {
          expect(err).to.not.be.undefined;
        });
    });

  });
});