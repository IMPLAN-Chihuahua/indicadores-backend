const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
require('dotenv').config();
chai.use(chaiHttp);
const { expect } = chai;
const { app, server } = require('../../../app');

const { Historico } = require('../../models');
const { someHistoricos } = require('../../utils/factories');
const { TOKEN_SECRET } = process.env;

describe('v1/historicos', function () {
    const historicos = someHistoricos(1);
    const validToken = jwt.sign({ sub: 100 }, TOKEN_SECRET, { expiresIn: '5h' });

    this.afterAll(function () {
        server.close();
    });

    this.afterEach(function () {
        sinon.restore();
    });

    describe('GET /historicos', function () {
        it('Should return a list of historicos with an INNER JOIN from indicadores', function () {
            const findAndCountALlFake = sinon.fake.resolves({ rows: historicos, count: historicos.length });
            sinon.replace(Historico, 'findAndCountAll', findAndCountALlFake);
            chai.request(app)
                .get('/api/v1/historicos/1')
                .set('Authorization', `Bearer ${validToken}`)
                .then(res => {
                    expect(findAndCountALlFake.calledOnce).to.be.true;
                    expect(res.body.historicos).to.be.an('array').that.is.not.empty;
                    expect(res.body.total).to.equal(historicos.length);
                });

        });
    });

});