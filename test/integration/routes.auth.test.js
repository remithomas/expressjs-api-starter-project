process.env.NODE_ENV = 'test';

const {describe, it} = require('mocha');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../app');

describe('Integration - Routes : auth : sign-in', () => {
	it('it should login an user', (done) => {
		const username = 'michel@michel.com';
		const password = 'michel123';

		chai.request(server)
			.post('/auth/sign-in')
			.send({username, password})
			.end((err, res) => {
				should.not.exist(err);
				res.redirects.length.should.eql(0);
				res.status.should.eql(200);
				res.type.should.eql('application/json');
				res.body.should.include.keys('status', 'token');
				res.body.status.should.eql('success');
				should.exist(res.body.token);
				done();
			});
	});

	it('it should reject login a fake user', (done) => {
		const username = 'fakemichel@michel.com';
		const password = 'michel123';

		chai.request(server)
			.post('/auth/sign-in')
			.send({ username, password })
			.end((error, res) => {
				should.exist(error);
				res.redirects.length.should.eql(0);
				res.status.should.eql(400);
				res.type.should.eql('application/json');
				done();
			});
	});

	it('it should reject login an empty user', (done) => {
		chai.request(server)
			.post('/auth/sign-in')
			.end((error, res) => {
				should.exist(error);
				res.redirects.length.should.eql(0);
				res.status.should.eql(400);
				res.type.should.eql('application/json');
				done();
			});
	});
});
