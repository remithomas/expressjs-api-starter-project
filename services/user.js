'use strict';

const UserModel = require('../models/').user;

const findByUsername = (username) => UserModel
	.findOne({
		where: {username},
		attributes: ['id', 'username', 'password', 'firstname', 'lastname']
	});

const findById = (userId) => UserModel
	.findOne({
		where: {id: userId},
		attributes: ['id', 'username', 'password', 'firstname', 'lastname']
	});

const findByRefreshToken = (refreshToken) => UserModel
	.findOne({
		where: {refresh_token: refreshToken},
		attributes: ['id', 'username', 'password', 'firstname', 'lastname']
	});

const serializeUser = ({id}) => ({id});

const setRefreshToken = (userId, refreshToken) => UserModel
	.findById(userId)
	.then((user) => user.update({refresh_token: refreshToken}));

const removeRefreshTokenToUser = (userId) => setRefreshToken(userId, null);

module.exports = {
	findById,
	findByRefreshToken,
	findByUsername,
	serializeUser,
	setRefreshToken,
	removeRefreshTokenToUser
};
