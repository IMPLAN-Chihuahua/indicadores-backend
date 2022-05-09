const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;

const { Historico } = require('../../models');

const HistoricoService = require('../../services/historicoService');
const { server } = require('../../../app');
const { someHistoricos } = require('../../utils/factories');

describe.only('Historicos service', function () {
    const historicos = someHistoricos(1);

    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    it('Should return a list of historicos with an INNER JOIN from indicadores', function () {
        const findAndCountALlFake = sinon.fake.resolves({ rows: historicos, count: historicos.length });
        sinon.replace(Historico, 'findAndCountAll', findAndCountALlFake);
        return HistoricoService.getHistoricos(1, 1, 1, { temaIndicador: 'lorem' })
            .then(res => {
                expect(findAndCountALlFake.calledOnce).to.be.true;
                expect(res.historicos).to.be.an('array').that.is.not.empty;
                expect(res.total).to.equal(historicos.length);
            });
    });

    it('Should not return any historicos at all', function () {
        const findAndCountALlFake = sinon.fake.resolves({ rows: [], count: 0 });
        sinon.replace(Historico, 'findAndCountAll', findAndCountALlFake);
        return HistoricoService.getHistoricos(1, 1, 1, { temaIndicador: 'lorem' })
            .then(res => {
                expect(findAndCountALlFake.calledOnce).to.be.true;
                expect(res.historicos).to.be.an('array').that.is.empty;
                expect(res.total).to.equal(0);
            });

    })
})