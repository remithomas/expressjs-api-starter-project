const express = require('express');
const router = express.Router();

const {OK_HTTP_STATUS_CODE} = require('../constants/http-status-codes');

router.get('/', (req, res) => {
	res.status(OK_HTTP_STATUS_CODE).json(req.user);
});

module.exports = router;
