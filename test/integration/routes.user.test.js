process.env.NODE_ENV = 'test';

const {describe, beforeEach, afterEach, it} = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../app');
const usersData = require('../util/users-data');
const AuthHelper = require('../../helpers/auth');
const TokenService = require('../../services/token');

const {
	OK_HTTP_STATUS_CODE,
	UNAUTHORIZED_HTTP_STATUS_CODE
} = require('../../constants/http-status-codes');

describe('Integration - Routes : user', () => {
	let sandbox = null;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox && sandbox.restore();
	});

	describe('With credential', () => {
		let token = null;
		const AuthHelper = require('../../helpers/auth');

		beforeEach(() => {
			token = AuthHelper.generateToken(usersData.user1);
		});

		afterEach(() => {
			token = null;
		});

		it('should access user (me)', (done) => {
			chai.request(server)
				.get('/me')
				.set('Authorization', 'Bearer ' + token)
				.end((error, response) => {
					response.should.have.status(OK_HTTP_STATUS_CODE);
					done();
				});
		});

		it('should deny access to user (wrong token)', (done) => {
			chai.request(server)
				.get('/me')
				.set('Authorization', 'Bearer FakeTokenFakeTokenFakeTokenFakeToken')
				.end((error, response) => {
					response.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
					done();
				});
		});
	});

	describe('with an blacklisted token', () => {
		let token = null, isBlacklistedTokenStub;

		beforeEach(() => {
			token = AuthHelper.generateToken(usersData.user1);
			isBlacklistedTokenStub = sandbox.stub(TokenService, 'isBlacklistedToken');
			isBlacklistedTokenStub.resolves({get: () => 1});
		});

		afterEach(() => {
			token = null;
			isBlacklistedTokenStub.restore();
		});

		it('should reject the auth token for user', (done) => {
			chai.request(server)
				.post('/me')
				.set('Authorization', 'Bearer ' + token)
				.end((error, response) => {
					response.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
					done();
				});
		});
	});

	describe('Without credential', () => {
		it('should deny access to user (me)', (done) => {
			chai.request(server)
				.get('/me')
				.end((error, response) => {
					response.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
					done();
				});
		});
	});
});
