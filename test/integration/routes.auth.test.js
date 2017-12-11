process.env.NODE_ENV = 'test';

const {describe, beforeEach, afterEach, it} = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../app');
const {
	OK_HTTP_STATUS_CODE,
	BAD_REQUEST_HTTP_STATUS_CODE,
	UNAUTHORIZED_HTTP_STATUS_CODE
} = require('../../constants/http-status-codes');

const AuthHelper = require('../../helpers/auth');
const UserService = require('../../services/user');
const usersData = require('../util/users-data');
const UserModel = require('../../models/').user;
const BlacklistedTokenModel = require('../../models/').blacklistedToken;

describe('Integration - Routes : Auth ', () => {
	let sandbox = null;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox && sandbox.restore();
	});

	describe('sign-in', () => {
		let updateStub;

		beforeEach(() => {
			updateStub = sandbox.stub(UserModel.prototype, 'update');
			updateStub.resolves({});
		});

		afterEach(() => {
			updateStub.restore();
		});

		it('should login an user', (done) => {
			const username = 'michel@michel.com';
			const password = 'michel123';

			chai.request(server)
				.post('/auth/sign-in')
				.send({username, password})
				.end((error, response) => {
					should.not.exist(error);
					response.redirects.length.should.eql(0);
					response.status.should.eql(OK_HTTP_STATUS_CODE);
					response.type.should.eql('application/json');

					response.body.should.include.keys('success', 'token', 'refreshToken');
					response.body.success.should.eql(true);
					should.exist(response.body.token);
					should.exist(response.body.refreshToken);

					chai.expect(updateStub.called).to.be.true;
					chai.expect(updateStub.calledOnce).to.be.true;
					done();
				});
		});

		it('should reject login to a fake user', (done) => {
			const username = 'fakemichel@michel.com';
			const password = 'michel123';

			chai.request(server)
				.post('/auth/sign-in')
				.send({username, password})
				.end((error, response) => {
					should.exist(error);
					response.redirects.length.should.eql(0);
					response.status.should.eql(BAD_REQUEST_HTTP_STATUS_CODE);
					response.type.should.eql('application/json');
					done();
				});
		});

		it('should reject login to an empty user', (done) => {
			chai.request(server)
				.post('/auth/sign-in')
				.end((error, response) => {
					should.exist(error);
					response.redirects.length.should.eql(0);
					response.status.should.eql(BAD_REQUEST_HTTP_STATUS_CODE);
					response.type.should.eql('application/json');
					done();
				});
		});
	});

	describe('refresh token', () => {
		let findByRefreshTokenStub;

		beforeEach(() => {
			findByRefreshTokenStub = sandbox.stub(UserService, 'findByRefreshToken');
		});

		afterEach(() => {
			findByRefreshTokenStub.restore();
		});

		describe('with valid refresh token', () => {
			beforeEach(() => {
				findByRefreshTokenStub.resolves({get: () => 1});
			});

			it('should refresh the auth token', (done) => {
				chai.request(server)
					.post('/auth/token')
					.send({refreshToken: 'refreshToken'})
					.end((_error, response) => {
						response.should.have.status(OK_HTTP_STATUS_CODE);
						response.body.should.include.keys('success', 'token');
						response.body.success.should.eql(true);
						should.exist(response.body.token);
						done();
					});
			});
		});

		describe('with invalid refresh token', () => {
			beforeEach(() => {
				findByRefreshTokenStub.resolves(null);
			});

			it('should refresh the auth token', (done) => {
				chai.request(server)
					.post('/auth/token')
					.send({refreshToken: 'fakerefreshToken'})
					.end((_error, response) => {
						response.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
						response.body.should.include.keys('success', 'message');
						response.body.success.should.eql(false);
						done();
					});
			});
		});
	});

	describe('reject refresh token', () => {
		let token = null, unvalidateRefreshTokenForUserStub, createTokenStub;

		describe('with a valid token', () => {
			beforeEach(() => {
				token = AuthHelper.generateToken(usersData.user1);

				unvalidateRefreshTokenForUserStub = sandbox.stub(AuthHelper, 'unvalidateRefreshTokenForUser');
				unvalidateRefreshTokenForUserStub.resolves();

				createTokenStub = sandbox.stub(BlacklistedTokenModel, 'create');
				createTokenStub.resolves({get: () => 1});
			});

			afterEach(() => {
				token = null;
				unvalidateRefreshTokenForUserStub.restore();
				createTokenStub.restore();
			});

			it('should reject the auth token for user 1 (post method)', (done) => {
				chai.request(server)
					.post('/auth/reject')
					.set('Authorization', 'Bearer ' + token)
					.end((_error, response) => {
						response.should.have.status(OK_HTTP_STATUS_CODE);
						response.body.should.include.keys('success');
						response.body.success.should.eql(true);

						chai.expect(createTokenStub.calledOnce).to.be.true;

						chai.expect(unvalidateRefreshTokenForUserStub.calledOnce).to.be.true;
						done();
					});
			});

			it('should reject the auth token for user 1 (get method)', (done) => {
				chai.request(server)
					.get('/auth/reject')
					.set('Authorization', 'Bearer ' + token)
					.end((_error, response) => {
						response.should.have.status(OK_HTTP_STATUS_CODE);
						response.body.should.include.keys('success');
						response.body.success.should.eql(true);

						chai.expect(createTokenStub.calledOnce).to.be.true;

						chai.expect(unvalidateRefreshTokenForUserStub.calledOnce).to.be.true;
						done();
					});
			});
		});

		describe('with an unvalid token', () => {
			let token = null;

			beforeEach(() => {
				token = 'invalid token';
			});

			afterEach(() => {
				token = null;
			});

			it('should reject the auth token for user', (done) => {
				chai.request(server)
					.post('/auth/reject')
					.set('Authorization', 'Bearer ' + token)
					.end((_error, response) => {
						response.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
						done();
					});
			});
		});
	});
});
