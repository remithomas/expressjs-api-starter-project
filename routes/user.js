const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.end('me !');
	// res.status(200).json(req.user);
});

module.exports = router;
