'use strict';

const bcrypt = require('bcryptjs');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const UserService = require('../services/user');
const {WRONG_CREDENTIAL_ERROR_CODE} = require('../constants/error-codes');

const getUser = (username) => UserService
	.findByUsername(username)
	.then((user) => {
		if (!user) return Promise.reject(WRONG_CREDENTIAL_ERROR_CODE);

		return user.get({
			plain: true
		});
	});

// eslint-disable-next-line no-sync
const comparePass = (userPassword, databasePassword) => bcrypt.compareSync(userPassword, databasePassword);

const _generateToken = (data, expiresIn) => jwt.sign(data, process.env.SECRET, {expiresIn});

const generateToken = (data) => _generateToken(data, process.env.TOKEN_EXPIRATION);
const generateRefreshToken = () => _generateToken({type: 'refresh'}, process.env.REFRESH_TOKEN_EXPIRATION);

const validateRefreshToken = (refreshToken, userId) => UserService
	.findByRefreshToken(refreshToken)
	.then((user) => !!user && user.get('id') === userId);

module.exports = {
	getUser,
	comparePass,
	generateToken,
	generateRefreshToken,
	validateRefreshToken
};
