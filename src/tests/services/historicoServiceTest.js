const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;

const { Historico } = require('../../models');

const HistoricoService = require('../../services/historicoService');
const { server } = require('../../../app');
const { someHistoricos } = require('../../utils/factories');

describe('Historicos service', function () {
    const historicos = someHistoricos(1);

    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    it('Should return a list of historicos with an INNER JOIN from indicadores', function () {
        const findAllFake = sinon.fake.resolves(historicos);
        sinon.replace(Historico, 'findAll', findAllFake);
        return HistoricoService.getHistoricos()
            .then(res => {
                expect(res).to.deep.equal(historicos);
                expect(res).to.be.an('array');
                expect(res).to.not.be.empty;
            }
            );
    })
})