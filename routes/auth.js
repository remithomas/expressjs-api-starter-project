'use strict';

const express = require('express');
const router = express.Router();

const auth = require('../auth/auth')();
const UserService = require('../services/user');
const TokenService = require('../services/token');
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

const sendUnauthorizedStatus = (response) => response.status(UNAUTHORIZED_HTTP_STATUS_CODE).json({
	success: false,
	message: 'The refresh token doesn\'t match'
});

router.post('/sign-in', async (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	try {
		const user = await validateCredential(username, password);
		const token = await createToken(user.id);
		const refreshToken = await createRefreshToken(token);

		await UserService.setRefreshToken(user.id, refreshToken);

		return response.status(OK_HTTP_STATUS_CODE).json({
			success: true,
			token,
			refreshToken
		});
	} catch (_error) {
		response.status(BAD_REQUEST_HTTP_STATUS_CODE).json({
			success: false,
			message: 'The username or password don\'t match'
		});
	}
});

router.post('/token', async (request, response) => {
	const refreshToken = request.body.refreshToken;

	if (!refreshToken) return response.status(UNAUTHORIZED_HTTP_STATUS_CODE).json({});

	try {
		const user = await UserService.findByRefreshToken(refreshToken);

		if (!user) return sendUnauthorizedStatus(response);

		const newAuthToken = await AuthHelper.generateToken({id: user.get('id')});

		return response.status(OK_HTTP_STATUS_CODE).json({
			success: true,
			token: newAuthToken
		});
	} catch (_error) {
		return sendUnauthorizedStatus(response);
	}
});

router.all('/reject', auth.authenticate(), async (request, response) => {
	try {
		const userId = request.user.id;
		const authToken = TokenService.extractTokenFromBearer(request.get('authorization'));

		await TokenService.blacklistAuthToken(authToken);

		return AuthHelper
			.unvalidateRefreshTokenForUser(userId)
			.then(() => response.status(OK_HTTP_STATUS_CODE).json({success: true}));
	} catch (_error) {
		return sendUnauthorizedStatus(response);
	}
});

module.exports = router;
