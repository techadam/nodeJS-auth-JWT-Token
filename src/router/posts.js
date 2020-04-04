const router = require('express').Router();
const verifyToken = require('./verifyToken');

router.get('/', verifyToken, async(req, res) => {

	res.json({
		title: "New movie droppa",
		description: "This movie is the bum and its so awesome",
	});
})

module.exports = router;