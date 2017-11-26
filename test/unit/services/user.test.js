'use strict';

const {describe, beforeEach, afterEach, it} = require('mocha');
const chai = require('chai');
const sinon = require('sinon');

const UserService = require('../../../services/user');
const UserModel = require('../../../models/').user;
const usersData = require('../../util/users-data');

describe('Unit - Service - User', () => {
	// Basic configuration: create a sinon sandbox for testing
	let sandbox = null;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox && sandbox.restore();
	});

	it('should have the user service', () => {
		chai.expect(UserService).to.exist;
	});

	describe('findByUsername', () => {
		it('should exist function', () => {
			chai.expect(UserService.findByUsername).to.exist;
		});

		it('should return a user', () => {
			const findOneSpy = sandbox.spy(UserModel, 'findOne');

			UserService
				.findByUsername('michel@michel.com')
				.then((user) => {
					chai.expect(findOneSpy.called).to.be.true;
					chai.expect(findOneSpy.calledOnce).to.be.true;

					chai.expect(user.get({
						plain: true
					})).deep.equals(usersData.user1);
				});
		});

		it('should return null if not found', () => {
			UserService
				.findByUsername(-1)
				.then((user) => chai.expect(user).to.be.null);
		});
	});

	describe('findById', () => {
		it('should exist function', () => {
			chai.expect(UserService.findById).to.exist;
		});

		it('should return a user', (done) => {
			UserService
				.findById(1)
				.then((user) => {
					chai.expect(user.get({
						plain: true
					})).deep.equals(usersData.user1);
					done();
				});
		});

		it('should return null if not found', () => {
			UserService
				.findById(-1)
				.then((user) => chai.expect(user).to.be.null);
		});
	});

	describe('serializeUser', () => {
		it('should exist function', () => {
			chai.expect(UserService.serializeUser).to.exist;
		});

		it('should serialize user', () => {
			chai.expect(UserService.serializeUser(usersData.user1)).deep.equals({
				id: 1
			});
		});
	});

	describe('setRefreshToken', () => {
		let updateStub;

		beforeEach(() => {
			updateStub = sandbox.stub(UserModel.prototype, 'update');
			updateStub.resolves({});
		});

		afterEach(() => {
			updateStub.restore();
		});

		it('should exist function', (done) => {
			chai.expect(UserService.setRefreshToken).to.exist;
			done();
		});

		it('should update refreshToken', (done) => {
			updateStub.resolves({id: 1});
			UserService.setRefreshToken(1, 'token')
				.then((user) => {
					chai.expect(user).to.be.not.null;
					chai.expect(updateStub.called).to.be.true;
					chai.expect(updateStub.calledOnce).to.be.true;
					done();
				});
		});
	});

	describe('findByRefreshToken', () => {
		let findOneStub;

		beforeEach(() => {
			findOneStub = sandbox.stub(UserModel, 'findOne');
		});

		afterEach(() => {
			findOneStub.restore();
		});

		it('should exist function', () => {
			chai.expect(UserService.findByRefreshToken).to.exist;
		});

		it('should return a user', (done) => {
			findOneStub.resolves({get: ()=> usersData.user1});

			UserService
				.findByRefreshToken('refreshToken')
				.then((user) => {
					chai.expect(findOneStub.called).to.be.true;
					chai.expect(findOneStub.calledOnce).to.be.true;

					chai.expect(user.get({
						plain: true
					})).deep.equals(usersData.user1);
					done();
				});
		});

		it('should return null if not found', () => {
			findOneStub.resolves(null);

			UserService
				.findByRefreshToken(-1)
				.then((user) => chai.expect(user).to.be.null);
		});
	});
});
