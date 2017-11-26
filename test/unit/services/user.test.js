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

	it('it should have the user service', () => {
		chai.expect(UserService).to.exist;
	});

	describe('findByUsername', () => {
		it('it should exist function', () => {
			chai.expect(UserService.findByUsername).to.exist;
		});

		it('it should return a user', () => {
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

		it('it should return null if not found', () => {
			UserService
				.findByUsername(-1)
				.then((user) => chai.expect(user).to.be.null);
		});
	});

	describe('findById', () => {
		it('it should exist function', () => {
			chai.expect(UserService.findById).to.exist;
		});

		it('it should return a user', (done) => {
			UserService
				.findById(1)
				.then((user) => {
					chai.expect(user.get({
						plain: true
					})).deep.equals(usersData.user1);
					done();
				});
		});

		it('it should return null if not found', () => {
			UserService
				.findById(-1)
				.then((user) => chai.expect(user).to.be.null);
		});
	});

	describe('serializeUser', () => {
		it('it should exist function', () => {
			chai.expect(UserService.serializeUser).to.exist;
		});

		it('it should serialize user', () => {
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

		it('it should exist function', (done) => {
			chai.expect(UserService.setRefreshToken).to.exist;
			done();
		});

		it('it should update refreshToken', (done) => {
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
		let findOneSpy;

		beforeEach(() => {
			findOneSpy = sandbox.stub(UserModel, 'findOne');
		});

		afterEach(() => {
			findOneSpy.restore();
		});

		it('it should exist function', () => {
			chai.expect(UserService.findByRefreshToken).to.exist;
		});

		it('it should return a user', (done) => {
			findOneSpy.resolves({get: ()=> usersData.user1});

			UserService
				.findByRefreshToken('refreshToken')
				.then((user) => {
					chai.expect(findOneSpy.called).to.be.true;
					chai.expect(findOneSpy.calledOnce).to.be.true;

					chai.expect(user.get({
						plain: true
					})).deep.equals(usersData.user1);
					done();
				});
		});

		it('it should return null if not found', () => {
			findOneSpy.resolves(null);

			UserService
				.findByRefreshToken(-1)
				.then((user) => chai.expect(user).to.be.null);
		});
	});
});
