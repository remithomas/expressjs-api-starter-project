const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.end('be early, be ready !');
});

module.exports = router;