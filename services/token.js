'use strict';

const BlacklistedTokenModel = require('../models/').blacklistedToken;
const {
	AUTH_TOKEN,
	REFRESH_TOKEN
} = require('../constants/token-types');

const blacklistToken = (token, tokenType) =>  BlacklistedTokenModel.create({token, type: tokenType});

const blacklistAuthToken = (token) => blacklistToken(token, AUTH_TOKEN);
const blacklistRefreshToken = (token) => blacklistToken(token, REFRESH_TOKEN);

const isBlacklistedToken = (token) => BlacklistedTokenModel
	.findOne({
		where: {token},
		attributes: ['id', 'createdAt']
	})
	.then((blacklistedToken) => !!blacklistedToken && !!blacklistedToken.get('id'));

const extractTokenFromBearer = (bearerAuthorization = '') => bearerAuthorization.replace('Bearer ', '');

module.exports = {
	blacklistToken,
	blacklistAuthToken,
	blacklistRefreshToken,
	extractTokenFromBearer,
	isBlacklistedToken
};
