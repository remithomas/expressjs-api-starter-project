'use strict';

const {describe, beforeEach, afterEach, it} = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

describe('Unit - Helpers - Auth', () => {
	let sandbox = null;

	const AuthHelper = require('../../../helpers/auth');
	const usersData = require('../../util/users-data');

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox && sandbox.restore();
	});

	describe('getUser', () => {
		it('it should exist function', () => {
			chai.expect(AuthHelper.getUser).to.exist;
		});

		it('it should return an user', () => {
			AuthHelper
				.getUser('michel@michel.com')
				.then((user) => {
					chai.expect(user).deep.equals(usersData.user1);
				});
		});

		it('it should reject an user', () => {
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

		it('it should exist function', () => {
			chai.expect(AuthHelper.comparePass).to.exist;
		});

		it('it should valid if right password', (done) => {
			const hash = bcrypt.hashSync('michel', salt);
			chai.expect(AuthHelper.comparePass('michel', hash)).to.be.true;
			done();
		});

		it('it should invalid if wrong password', (done) => {
			const hash = bcrypt.hashSync('michel', salt);
			chai.expect(AuthHelper.comparePass('fakemichel', hash)).to.be.false;
			done();
		});

		it('it should invalid if empty password', (done) => {
			const hash = bcrypt.hashSync('michel', salt);
			chai.expect(AuthHelper.comparePass('', hash)).to.be.false;
			done();
		});
	});

	describe('generateToken', () => {
		it('it should exist function', () => {
			chai.expect(AuthHelper.generateToken).to.exist;
		});

		it('it should generate token for userdata', () => {
			chai.expect(AuthHelper.generateToken({
				id: 1,
				username: 'michel@michel.com'
			})).to.be.string;
		});
	});
});
