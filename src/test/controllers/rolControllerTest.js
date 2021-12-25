const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const rolController = require('../../controllers/rolController');
chai.use(chaiHttp);

describe('api/v1/roles', function () {
    const baseUrl = 'http://localhost:8080/api/v1';

    const rol = {

    };

    describe('GET', function () {
        let token = faker.random.word();

        it('should get a list of roles', function (done) {
            rolController.getRoles(null, res)
                .then(result => console.log(result))
                .catch(err => console.log(err));

            chai.request(baseUrl)
                .get('/roles')
                .set('Authorization', token)
                .end((_, res) => {
                    expect(res.body.data).to.be.lengthOf(3);
                });
        });

    });

});
