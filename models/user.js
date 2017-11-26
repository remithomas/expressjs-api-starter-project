'use strict';

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		lastname: DataTypes.STRING,
		firstname: DataTypes.STRING,
		refresh_token: DataTypes.STRING
	}, {
		classMethods: {
			associate: (_models) => {
				// associations can be defined here
			}
		}
	});

	return User;
};
