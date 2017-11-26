process.env.NODE_ENV = 'test';

const {describe, beforeEach, afterEach, it} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../app');
const usersData = require('../util/users-data');

const {
	OK_HTTP_STATUS_CODE,
	UNAUTHORIZED_HTTP_STATUS_CODE
} = require('../../constants/http-status-codes');

describe('Integration - Routes : user', () => {

	describe('With credential', () => {
		let token = null;
		const AuthHelper = require('../../helpers/auth');

		beforeEach(() => {
			token = AuthHelper.generateToken(usersData.user1);
		});

		afterEach(() => {
			token = null;
		});

		it('it should access user (me)', (done) => {
			chai.request(server)
				.get('/me')
				.set('Authorization', 'Bearer ' + token)
				.end((err, res) => {
					res.should.have.status(OK_HTTP_STATUS_CODE);
					done();
				});
		});

		it('it should deny access to user (wrong token)', (done) => {
			chai.request(server)
				.get('/me')
				.set('Authorization', 'Bearer FakeTokenFakeTokenFakeTokenFakeToken')
				.end((err, res) => {
					res.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
					done();
				});
		});
	});

	describe('Without credential', () => {
		it('it should deny access to user (me)', (done) => {
			chai.request(server)
				.get('/me')
				.end((err, res) => {
					res.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
					done();
				});
		});
	});
});
