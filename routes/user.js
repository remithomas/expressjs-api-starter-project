const express = require('express');
const router = express.Router();

const {OK_HTTP_STATUS_CODE} = require('../constants/http-status-codes');

router.get('/', (request, response) => {
	response.status(OK_HTTP_STATUS_CODE).json(request.user);
});

module.exports = router;
