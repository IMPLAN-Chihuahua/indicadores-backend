/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const { expect } = chai;
chai.use(chaiHttp);
const { app, server } = require('../../../app');
const { CatalogoDetail } = require('../../models');
const { aDummyWithName } = require('../../utils/factories');

const { TOKEN_SECRET } = process.env;

describe('/catalogos', function () {

	const token = jwt.sign({ sub: 1 }, TOKEN_SECRET, { expiresIn: '5h' }); 1

	const setOfItems = [aDummyWithName(1), aDummyWithName(2), aDummyWithName(3)];

	this.afterEach(function () {
		sinon.restore();
	});

	this.afterAll(function () {
		server.close();
	});

	it('Should return a list of Catalogos', function (done) {
		sinon.replace(CatalogoDetail, 'findAll', sinon.fake.resolves(setOfItems));

		chai.request(app)
			.get('/api/v1/catalogos')
			.end(function (err, res) {
				console.log(res.body)
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res.body.data).to.be.an('array');
				done();
			});
	});

});