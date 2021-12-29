const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
chai.use(chaiHttp);

describe('api/v1/roles', function () {
    const baseUrl = 'http://localhost:8080/api/v1';

    const res = {

    };

    describe('GET', function () {
        let token = faker.random.word();
        it('should get a list of roles', function (done) {
            chai.request(baseUrl)
                .get('/roles')
                .set('Authorization', token)
                .end((_, res) => {
                    expect(res.body.data).to.be.lengthOf(3);
                    done()
                });
        });
    });
});
