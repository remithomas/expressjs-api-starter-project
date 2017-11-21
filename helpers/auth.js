'use strict';

const bcrypt = require('bcryptjs');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const UserService = require('../services/user');
const {WRONG_CREDENTIAL} = require('../constants/error-codes');

function getUser(username) {
	return UserService.findByUsername(username).then((user) => {
		if (!user) return Promise.reject(WRONG_CREDENTIAL);

		return user.get({
			plain: true
		});
	});
}

function comparePass(userPassword, databasePassword) {
	// eslint-disable-next-line no-sync
	return bcrypt.compareSync(userPassword, databasePassword);
}

function generateToken(data) {
	return jwt.sign(data, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
}

module.exports = {
	getUser,
	comparePass,
	generateToken
};
