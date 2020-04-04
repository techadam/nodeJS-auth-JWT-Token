const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('../validator');

router.post('/register', async(req, res) => {
	
	//Schema validation
	const { error } = validator.registerValidation(req.body);
	
	if(error) return res.status(400).json(error.details[0].message);


	//Check if email already exists
	const emailExist = await User.findOne({email: req.body.email});

	if(emailExist) return res.status(400).json("Email already exists");


	//Hash User Password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);


	//Create new user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	})

	try {
		const newUser = await user.save();
		res.send({_id: newUser._id});
	}catch(e) {
		res.status(400).send(error);
	}
});


router.post('/login', async (req, res) => {
	//Schema validation
	const { error } = validator.loginValidation(req.body);
	
	if(error) return res.status(400).json(error.details[0].message);


	//Check if email already exists
	const user = await User.findOne({email: req.body.email});

	if(!user) return res.status(400).json("Email not found");

	//verify user password
	const validPass = await bcrypt.compare(req.body.password, user.password);

	if(!validPass) return res.status(400).json("Invalid password");

	//Create Auth token with JWT
	const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
	res.header('auth-token', token).json({token: token});
});

module.exports = router;