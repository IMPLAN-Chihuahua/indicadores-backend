/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
const { UsuarioIndicador } = require('../../models');
const UsuarioIndicadorService = require('../../services/usuarioIndicadorService');
const { server } = require('../../../app');

describe('Usuario-Indicador service', function () {

  this.afterEach(function () {
    sinon.restore();
  });

  this.afterAll(function () {
    server.close();
  });

  describe('Read operations', () => {
    it('Returns true if user has a relation with an indicador', () => {
      const findOneFake = sinon.fake.resolves({ count: 1 });
      sinon.replace(UsuarioIndicador, 'findOne', findOneFake)
      return UsuarioIndicadorService.areConnected(1, 1)
        .then(res => {
          expect(res).to.be.true;
          expect(findOneFake.calledOnce).to.be.true;
        });
    });

    it('Should fail due to connection to DB failed', () => {
      const findOneFake = sinon.fake.rejects(new Error('Connection to DB failed'));
      sinon.replace(UsuarioIndicador, 'findOne', findOneFake);
      return UsuarioIndicadorService.areConnected(1, 1)
        .catch(err => {
          expect(findOneFake.calledOnce).to.be.true;
          expect(err).to.not.be.undefined;
        });
    });

  });
});