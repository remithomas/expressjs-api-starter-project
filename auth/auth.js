'use strict';

const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');
const UserService = require('../services/user');

const params = {
	secretOrKey: process.env.SECRET,
	jwtFromRequest: ExtractJwt.versionOneCompatibility({authScheme: 'Bearer'})
};

module.exports = () => {
	const strategy = new Strategy(params, ((payload, done) => {
		UserService.findById(payload.id).then((user => {
			if (user) {
				return done(null, user);
			}
			return done(new Error('User not found'), null);
		}));
	}));

	passport.use(strategy);

	return {
		initialize () {
			return passport.initialize();
		},
		authenticate () {
			return passport.authenticate('jwt', {session: false});
		}
	};
};
