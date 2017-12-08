'use strict';

const BlacklistedTokenModel = require('../models/').blacklistedToken;
const {
	AUTH_TOKEN,
	REFRESH_TOKEN
} = require('../constants/token-types');

const blacklistToken = (token, tokenType) => {
	return BlacklistedTokenModel.create({
		token,
		type: tokenType
	});
};

const blacklistAuthToken = (token) => blacklistToken(token, AUTH_TOKEN);
const blacklistRefreshToken = (token) => blacklistToken(token, REFRESH_TOKEN);

const isBlacklistedToken = (token) => BlacklistedTokenModel
	.findOne({
		where: {token},
		attributes: ['id', 'createdAt']
	})
	.then((blacklistedToken) => !!blacklistedToken);

module.exports = {
	blacklistToken,
	blacklistAuthToken,
	blacklistRefreshToken,
	isBlacklistedToken
};
