const chai = require('chai');
const expect = chai.expect;
const { Indicador } = require('../../models');
const IndicadorService = require('../../services/indicadorService');
const sinon = require('sinon');
const { server } = require('../../../app');
const { anIndicador } = require('../../utils/factories');

describe('Indicador service', function () {

    const indicadores = [anIndicador(1), anIndicador(2)];

    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    it('Returns a list of indicadores and the total number of them', function () {
        const findAndCountAllFake = sinon.fake.resolves({ rows: indicadores, count: indicadores.length });
        sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);
        return IndicadorService.getIndicadores(1, 15, { idModulo: 15 })
            .then(res => {
                expect(findAndCountAllFake.calledOnce).to.be.true;
                expect(res.indicadores).to.be.an('array').that.is.not.empty;
                expect(res.total).to.equal(indicadores.length);
            });
    });

    it('Returns an indicador', function () {
        const findOneFake = sinon.fake.resolves({ ...anIndicador(1) });
        sinon.replace(Indicador, 'findOne', findOneFake);
        return IndicadorService.getIndicador(1)
            .then(res => {
                expect(findOneFake.args[0][0].where.id).to.be.equal(1);
                expect(findOneFake.calledOnce).to.be.true;
                expect(res).to.not.be.null;
            })
    });

    it('Rejects promise if there\'s an error', function () {
        const findAndCountAllFake = sinon.fake.rejects(new Error());
        sinon.replace(Indicador, 'findAndCountAll', findAndCountAllFake);
        return IndicadorService.getIndicadores(1, 15, { idModulo: 15 })
            .then(res => {
                expect(res).to.be.null;
            })
            .catch(err => {
                expect(findAndCountAllFake.calledOnce).to.be.true;
                expect(err).to.not.be.null;
            });
    });

    it('Returns null if no indicador is found', function () {
        const findOneFake = sinon.fake.resolves(null);
        sinon.replace(Indicador, 'findOne', findOneFake);
        return IndicadorService.getIndicador(1)
            .then(res => {
                expect(res).to.be.null;
                expect(findOneFake.calledOnce).to.be.true;
                expect(findOneFake.args[0][0]).to.not.be.null;
            })
            .catch(err => {
            });
    });

});


