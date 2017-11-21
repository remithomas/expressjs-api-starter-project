'use strict';

const {describe, beforeEach, afterEach, it} = require('mocha');
const chai = require('chai');
const sinon = require('sinon');

describe('Unit - Service - User', () => {
	const UserService = require('../../../services/user');
	const UserModel = require('../../../models/').user;
	const usersData = require('../../util/users-data');

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
});
