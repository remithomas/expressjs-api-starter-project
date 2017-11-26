'use strict';

const express = require('express');
const router = express.Router();

const UserService = require('../services/user');
const AuthHelper = require('../helpers/auth');
const {WRONG_CREDENTIAL_ERROR_CODE} = require('../constants/error-codes');
const {
	OK_HTTP_STATUS_CODE,
	BAD_REQUEST_HTTP_STATUS_CODE,
	UNAUTHORIZED_HTTP_STATUS_CODE
} = require('../constants/http-status-codes');

const validateCredential = (username, password) => AuthHelper
	.getUser(username)
	.then((user) => {
		const isValidatedPassword = AuthHelper.comparePass(password, user.password);
		if (!isValidatedPassword) return Promise.reject(WRONG_CREDENTIAL_ERROR_CODE);

		return user;
	});

const createToken = async (userId) => AuthHelper.generateToken({id: userId});

const createRefreshToken = async () => AuthHelper.generateRefreshToken();

const sendUnauthorizedStatus = (res) => res.status(UNAUTHORIZED_HTTP_STATUS_CODE).json({
	success: false,
	message: 'The refresh token doesn\'t match'
});

router.post('/sign-in', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	try {
		const user = await validateCredential(username, password);
		const token = await createToken(user.id);
		const refreshToken = await createRefreshToken(token);

		await UserService.setRefreshToken(user.id, refreshToken);

		return res.status(OK_HTTP_STATUS_CODE).json({
			success: true,
			token,
			refreshToken
		});
	} catch (_error) {
		res.status(BAD_REQUEST_HTTP_STATUS_CODE).json({
			success: false,
			message: 'The username or password don\'t match'
		});
	}
});

router.post('/token', async (req, res) => {
	const refreshToken = req.body.refreshToken;

	if (!refreshToken) return res.status(UNAUTHORIZED_HTTP_STATUS_CODE).json({});

	try {
		const user = await UserService.findByRefreshToken(refreshToken);

		if (!user) return sendUnauthorizedStatus(res);

		const newAuthToken = await AuthHelper.generateToken({id: user.get('id')});

		return res.status(OK_HTTP_STATUS_CODE).json({
			success: true,
			token: newAuthToken
		});
	} catch (_error) {
		return sendUnauthorizedStatus(res);
	}
});

module.exports = router;
