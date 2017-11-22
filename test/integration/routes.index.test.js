process.env.NODE_ENV = 'test';

const {describe, it} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../app');

describe('Integration - Routes : index', () => {
	it('it should access API', (done) => {
		chai.request(server)
			.get('/')
			.end((_error, res) => {
				res.should.have.status(200);
				done();
			});
	});

	it('it should show page not found API', (done) => {
		chai.request(server)
			.get('/oups')
			.end((_error, res) => {
				res.should.have.status(404);
				done();
			});
	});
});
