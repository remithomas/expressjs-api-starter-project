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

const UserModel = require('../../models/').user;
const UserService = require('../../services/user');

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
				.end((error, res) => {
					should.not.exist(error);
					res.redirects.length.should.eql(0);
					res.status.should.eql(OK_HTTP_STATUS_CODE);
					res.type.should.eql('application/json');

					res.body.should.include.keys('success', 'token', 'refreshToken');
					res.body.success.should.eql(true);
					should.exist(res.body.token);
					should.exist(res.body.refreshToken);

					chai.expect(updateStub.called).to.be.true;
					chai.expect(updateStub.calledOnce).to.be.true;
					done();
				});
		});

		it('should reject login a fake user', (done) => {
			const username = 'fakemichel@michel.com';
			const password = 'michel123';

			chai.request(server)
				.post('/auth/sign-in')
				.send({username, password})
				.end((error, res) => {
					should.exist(error);
					res.redirects.length.should.eql(0);
					res.status.should.eql(BAD_REQUEST_HTTP_STATUS_CODE);
					res.type.should.eql('application/json');
					done();
				});
		});

		it('should reject login an empty user', (done) => {
			chai.request(server)
				.post('/auth/sign-in')
				.end((error, res) => {
					should.exist(error);
					res.redirects.length.should.eql(0);
					res.status.should.eql(BAD_REQUEST_HTTP_STATUS_CODE);
					res.type.should.eql('application/json');
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
					.end((_error, res) => {
						res.should.have.status(OK_HTTP_STATUS_CODE);
						res.body.should.include.keys('success', 'token');
						res.body.success.should.eql(true);
						should.exist(res.body.token);
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
					.end((_error, res) => {
						res.should.have.status(UNAUTHORIZED_HTTP_STATUS_CODE);
						res.body.should.include.keys('success', 'message');
						res.body.success.should.eql(false);
						done();
					});
			});
		});
	});
});
