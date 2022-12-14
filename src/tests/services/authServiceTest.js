/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const faker = require('faker');
const sinon = require('sinon');
const UsuarioService = require('../../services/usuariosService');
const { expect } = chai;
const { UsuarioIndicador } = require('../../models');
const { server } = require('../../../app')
const { aUser, anIndicador } = require('../../utils/factories');
const { validate } = require('../../services/authService');

describe('User service', function () {

  const usuario = aUser(faker.datatype.number());

  this.afterEach(function () {
    sinon.restore();
  });

  this.afterAll(function () {
    server.close();
  });

  describe('Permissions service', () => {

    it('Should execute function if rol is admin', () => {
      const successMessage = 'on allowed because rol is admin'
      return validate(
        { rol: 'ADMIN', idUsuario: 1, idIndicador: 1 },
        () => successMessage,
        () => 'on not allowed'
      )
        .then(res => {
          expect(res).to.be.equal(successMessage);
        })
    })

    it('Should execute function because user is assigned to indicador', () => {
      const findOneRelation = sinon.fake.resolves({ count: 1 });
      sinon.replace(UsuarioIndicador, 'findOne', findOneRelation);
      const successMessage = 'on allowed because user is assigned to indicador';
      return validate(
        { rol: 'USER', idUsuario: 1, idIndicador: 1 },
        () => successMessage,
        () => 'on not allowed'
      )
        .then(res => {
          expect(res).to.be.equal(successMessage);
        })
    })

    it('Should execute not allowed function because user is not assigned to indicador', () => {
      const findOneRelation = sinon.fake.resolves({ count: 0 });
      sinon.replace(UsuarioIndicador, 'findOne', findOneRelation);
      const onNotAllowedMessage = 'this has to execute';
      return validate(
        { rol: 'USER', idUsuario: 1, idIndicador: 1 },
        () => 'on allowed',
        () => onNotAllowedMessage
      )
        .then(res => {
          expect(res).to.be.equal(onNotAllowedMessage);
        })
    })

  });
});