'use strict';

// load env config
require('dotenv').config();

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const auth = require('./auth/auth')();

const app = express();

app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(auth.initialize());

app.use(morgan('dev', {
	skip: (_request, _response) => process.env.NODE_ENV !== 'development'
}));

// Cross domain requests
const allowCrossDomain = function (request, response, next) {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
};
app.use(allowCrossDomain);

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/me', auth.authenticate(), require('./routes/user'));

// catch 404 and forward to error handler
app.use((request, response, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((error, request, response) => {
	response.status(error.status || 500);
	response.send({
		message: error.message,
		error: (app.get('env') === 'development') ? error : {}
	});
	return;
});

app.get('*', (request, response) => response.end(''));

module.exports = app;
