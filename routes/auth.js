'use strict';

const Promise = require('bluebird');
const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/auth');
const {WRONG_CREDENTIAL} = require('../constants/error-codes');

router.post('/sign-in', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	return AuthHelper.getUser(username)
		.then((user) => {
			const isValidatedPassword = AuthHelper.comparePass(password, user.password);
			if (!isValidatedPassword) return Promise.reject(WRONG_CREDENTIAL);

			return user;
		})
		.then((user) => {
			const token = AuthHelper.generateToken(user);
			res.status(200).json({
				status: 'success',
				token
			});
		})
		.catch((error) => {
			res.status(400).json({
				status: 'error',
				error
			});
		});
});

module.exports = router;
