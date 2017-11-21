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
		where: { id: userId },
		attributes: ['id', 'username', 'password', 'firstname', 'lastname']
	});
};

module.exports = {
	findByUsername,
	findById
};
