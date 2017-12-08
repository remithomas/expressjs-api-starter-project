'use strict';
module.exports = (sequelize, DataTypes) => {
	const blacklistedToken = sequelize.define('blacklistedToken', {
		token: DataTypes.STRING,
		type: DataTypes.STRING
	}, {
		classMethods: {
			associate(_models) {
				// associations can be defined here
			}
		}
	});
	return blacklistedToken;
};
