'use strict';

const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');
const UserService = require('../services/user');
const TokenService = require('../services/token');

const params = {
	secretOrKey: process.env.SECRET,
	jwtFromRequest: ExtractJwt.versionOneCompatibility({authScheme: 'Bearer'})
};

module.exports = () => {
	const strategy = new Strategy(params, (async (payload, done) => {
		const user = await UserService.findById(payload.id);

		if (!user) return done(new Error('User not found'), null);
		const {id, username, firstname, lastname} = user;
		return done(null, {id, username, firstname, lastname});
	}));

	passport.use(strategy);

	return {
		initialize () {
			return passport.initialize();
		},

		authenticate () {
			return async (req, res, next) => {
				const {authorization} = req.headers || {};
				const authToken = TokenService.extractTokenFromBearer(authorization);

				const isBlacklistedToken = await TokenService.isBlacklistedToken(authToken);
				if (isBlacklistedToken) req.headers.authorization = '';

				return passport.authenticate('jwt', {session: false})(req, res, next);
			};
		}
	};
};
