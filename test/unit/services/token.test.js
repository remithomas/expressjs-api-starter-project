'use strict';

const {describe, beforeEach, afterEach, it} = require('mocha');
const chai = require('chai');
const sinon = require('sinon');

const TokenService = require('../../../services/token');
const AuthHelper = require('../../../helpers/auth');
const usersData = require('../../util/users-data');
const BlacklistedTokenModel = require('../../../models/').blacklistedToken;

describe('Unit - Service - Token', () => {
	// Basic configuration: create a sinon sandbox for testing
	let sandbox = null;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox && sandbox.restore();
	});

	it('should have the token service', () => {
		chai.expect(TokenService).to.exist;
	});

	describe('blacklistToken', () => {
		it('should exist function', () => {
			chai.expect(TokenService.blacklistToken).to.exist;
		});

		describe('blacklist an auth token', () => {
			let token = null, createStub;

			beforeEach(() => {
				token = AuthHelper.generateToken(usersData.user1);
				createStub = sandbox.stub(BlacklistedTokenModel, 'create');
				createStub.resolves({id: 1});
			});

			afterEach(() => {
				token = null;
				createStub.restore();
			});

			it('should exist function', () => {
				chai.expect(TokenService.blacklistAuthToken).to.exist;
			});

			it('should black a authToken', (done) => {
				TokenService.blacklistAuthToken(token)
					.then(() => {
						chai.expect(createStub.calledOnce).to.be.true;
						done();
					});
			});
		});

		describe('blacklist an refresh token', () => {
			let token = null, createStub;

			beforeEach(() => {
				token = AuthHelper.generateToken(usersData.user1);
				createStub = sandbox.stub(BlacklistedTokenModel, 'create');
				createStub.resolves({id: 1});
			});

			afterEach(() => {
				token = null;
				createStub.restore();
			});

			it('should exist function', () => {
				chai.expect(TokenService.blacklistRefreshToken).to.exist;
			});

			it('should black a refreshToken', (done) => {
				TokenService.blacklistRefreshToken(token)
					.then(() => {
						chai.expect(createStub.calledOnce).to.be.true;
						done();
					});
			});
		});
	});

	describe('isBlacklistedToken', () => {
		let findOneStub;

		beforeEach(() => {
			findOneStub = sandbox.stub(BlacklistedTokenModel, 'findOne');
		});

		afterEach(() => {
			findOneStub.restore();
		});

		it('should exist function', () => {
			chai.expect(TokenService.isBlacklistedToken).to.exist;
		});

		describe('with a non-blacklisted token', () => {
			beforeEach(() => {
				findOneStub.resolves(null);
			});

			it('should reject the token', (done) => {
				const promise = TokenService.isBlacklistedToken('non_blacklisted_token');
				promise.should.be.fulfilled;
				promise.should.become(false).and.notify(done);
			});
		});

		describe('with a blacklisted token', () => {
			beforeEach(() => {
				findOneStub.resolves({get: () => 1});
			});

			it('should resolve the token', (done) => {
				const promise = TokenService.isBlacklistedToken('blacklisted token');
				promise.should.be.fulfilled;
				promise.should.become(true).and.notify(done);
			});
		});
	});

	describe('extractTokenFromBearer', () => {
		it('should exist function', () => {
			chai.expect(TokenService.extractTokenFromBearer).to.exist;
		});

		it('should extract token', () => {
			chai.expect(TokenService.extractTokenFromBearer('Bearer mytoken')).to.deep.equals('mytoken');
			chai.expect(TokenService.extractTokenFromBearer('Bearer ')).to.deep.equals('');
			chai.expect(TokenService.extractTokenFromBearer('')).to.deep.equals('');
			chai.expect(TokenService.extractTokenFromBearer()).to.deep.equals('');
		});
	});
});
