'use strict';

const UserModel = require('../models/').user;

const findByUsername = function(username) {
	return UserModel.findOne({
		where: {username},
		attributes: ['id', 'username', 'password', 'firstname', 'lastname']
	});
};

const findById = function(userId) {
	return UserModel.findOne({
		where: {id: userId},
		attributes: ['id', 'username', 'password', 'firstname', 'lastname']
	});
};

const findByRefreshToken = function(refreshToken) {
	return UserModel.findOne({
		where: {refresh_token: refreshToken},
		attributes: ['id', 'username', 'password', 'firstname', 'lastname']
	});
};

const serializeUser = function({id}) {
	return {
		id
	};
};

const setRefreshToken = function(userId, refreshToken) {
	return UserModel.findById(userId)
		.then((user) => user.update({refresh_token: refreshToken}));
};

module.exports = {
	findById,
	findByRefreshToken,
	findByUsername,
	serializeUser,
	setRefreshToken
};
