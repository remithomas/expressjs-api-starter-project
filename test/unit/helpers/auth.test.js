'use strict';

const {describe, beforeEach, afterEach, it} = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

chai.use(chaiAsPromised);

const AuthHelper = require('../../../helpers/auth');
const usersData = require('../../util/users-data');
const UserService = require('../../../services/user');
const UserModel = require('../../../models/').user;

describe('Unit - Helpers - Auth', () => {
	let sandbox = null;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox && sandbox.restore();
	});

	describe('getUser', () => {
		it('should exist function', () => {
			chai.expect(AuthHelper.getUser).to.exist;
		});

		it('should return an user', () => {
			AuthHelper
				.getUser('michel@michel.com')
				.then((user) => {
					chai.expect(user).deep.equals(usersData.user1);
				});
		});

		it('should reject an user', () => {
			AuthHelper
				.getUser('fakemichel@michel.com')
				.catch((errorCode) => {
					chai.expect(errorCode).deep.equals('wrong-credential');
				});
		});
	});

	describe('comparePass', () => {
		let salt = null;

		beforeEach(() => {
			salt = bcrypt.genSaltSync();
		});

		afterEach(() => {
			salt = null;
		});

		it('should exist function', () => {
			chai.expect(AuthHelper.comparePass).to.exist;
		});

		it('should valid if right password', (done) => {
			const hash = bcrypt.hashSync('michel', salt);
			chai.expect(AuthHelper.comparePass('michel', hash)).to.be.true;
			done();
		});

		it('should invalid if wrong password', (done) => {
			const hash = bcrypt.hashSync('michel', salt);
			chai.expect(AuthHelper.comparePass('fakemichel', hash)).to.be.false;
			done();
		});

		it('should invalid if empty password', (done) => {
			const hash = bcrypt.hashSync('michel', salt);
			chai.expect(AuthHelper.comparePass('', hash)).to.be.false;
			done();
		});
	});

	describe('generateToken', () => {
		it('should exist function', () => {
			chai.expect(AuthHelper.generateToken).to.exist;
		});

		it('should generate token for userdata', () => {
			chai.expect(AuthHelper.generateToken({
				id: 1,
				clientId: 1
			})).to.be.string;
		});
	});

	describe('generateRefreshToken', () => {
		it('should exist function', () => {
			chai.expect(AuthHelper.generateRefreshToken).to.exist;
		});

		it('should generate token for userdata', () => {
			chai.expect(AuthHelper.generateRefreshToken()).to.be.string;
		});
	});

	describe('validateRefreshToken', () => {
		it('should exist function', () => {
			chai.expect(AuthHelper.validateRefreshToken).to.exist;
		});

		describe('with existing user', () => {
			let findByRefreshTokenStub;

			beforeEach(() => {
				findByRefreshTokenStub = sandbox.stub(UserService, 'findByRefreshToken');
				findByRefreshTokenStub.resolves({get: () => 1});
			});

			afterEach(() => {
				findByRefreshTokenStub.restore();
			});

			it('should validate refresh token', (done) => {
				const promise = AuthHelper.validateRefreshToken('refreshToken', 1);
				promise.should.be.fulfilled;
				promise.should.become(true).and.notify(done);
			});

			it('should unvalidate refresh token', (done) => {
				findByRefreshTokenStub.resolves({get: () => 2});

				const promise = AuthHelper.validateRefreshToken('fake refreshToken', 1);
				promise.should.be.fulfilled;
				promise.should.become(false).and.notify(done);
			});
		});

		describe('without not found user', () => {
			let findByRefreshTokenStub;

			beforeEach(() => {
				findByRefreshTokenStub = sandbox.stub(UserService, 'findByRefreshToken');
				findByRefreshTokenStub.resolves(null);
			});

			afterEach(() => {
				findByRefreshTokenStub.restore();
			});

			it('should unvalidate refresh token', (done) => {
				const promise = AuthHelper.validateRefreshToken('refreshToken', 1);

				promise.should.be.fulfilled;
				promise.should.become(false).and.notify(done);
			});
		});
	});

	describe('unvalidateRefreshTokenForUser', () => {
		it('should exist function', () => {
			chai.expect(AuthHelper.unvalidateRefreshTokenForUser).to.exist;
		});

		describe('with existing user', () => {
			let removeRefreshTokenToUserStub, updateStub;

			beforeEach(() => {
				removeRefreshTokenToUserStub = sandbox.stub(UserService, 'removeRefreshTokenToUser');
				removeRefreshTokenToUserStub.resolves();

				updateStub = sandbox.stub(UserModel.prototype, 'update');
				updateStub.resolves();
			});

			afterEach(() => {
				removeRefreshTokenToUserStub.restore();
				updateStub.restore();
			});

			it('should unvalidate refresh token', (done) => {
				AuthHelper.unvalidateRefreshTokenForUser(1)
					.then(() => {
						chai.expect(removeRefreshTokenToUserStub.calledOnce).to.be.true;
						done();
					});
			});
		});
	});
});
