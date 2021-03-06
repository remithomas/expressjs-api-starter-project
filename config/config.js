module.exports = {
	'development': {
		'dialect': 'postgres',
		'use_env_variable': 'DATABASE_URL'
	},
	'test': {
		'dialect': 'sqlite',
		'storage': 'data/test-db.sqlite3',
		'logging': false
	},
	'production': {
		'dialect': 'postgres',
		'use_env_variable': 'DATABASE_URL',
		'logging': false
	}
};
