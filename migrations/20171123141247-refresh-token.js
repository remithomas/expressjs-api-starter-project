'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addColumn(
			'users',
			'refresh_token',
			Sequelize.STRING
		);
  },

	down: (queryInterface, Sequelize) => {
		queryInterface.removeColumn(
			'users',
			'refresh_token'
		);
	}
};
