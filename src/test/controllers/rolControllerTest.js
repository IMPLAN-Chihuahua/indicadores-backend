const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('api/v1/roles', function () {
    const baseUrl = 'http://localhost:8080/api/v1';

    describe('GET', function () {
        it('should get a list of roles', function (done) {
            chai.request(baseUrl)
                .get('/roles')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done()
                });
        });
    });
    
});
