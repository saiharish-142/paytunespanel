const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const admin = mongoose.model('admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const adminauth = require('../authenMiddleware/adminauth');

router.post('/signup', (req, res) => {
	const { username, password, email, usertype } = req.body;
	if (!username || !password || !email || !usertype) {
		return res.status(422).json({ error: 'please enter all the required fields' });
	}
	admin
		.findOne({ email: email })
		.then((saveduser) => {
			if (saveduser) {
				return res.status(422).json({ error: 'user already exists...' });
			}
			bcrypt
				.hash(password, 12)
				.then((hashpass) => {
					const adminU = new admin({
						username,
						password: hashpass,
						email,
						usertype
					});
					adminU
						.save()
						.then((savedAdmin) => {
							const token = jwt.sign({ _id: savedAdmin._id }, JWT_SECRET);
							savedAdmin.password = undefined;
							res.json({ message: 'admin saved Successfully...', token, user: savedAdmin });
						})
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
});

router.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(422).json({ error: 'please enter all fields' });
	}
	admin
		.findOne({ email: email })
		.then((saveduser) => {
			if (!saveduser) {
				return res.status(422).json({ error: 'Invalid Email or Password' });
			}
			bcrypt
				.compare(password, saveduser.password)
				.then((doMatch) => {
					if (doMatch) {
						const token = jwt.sign({ _id: saveduser._id }, JWT_SECRET);
						saveduser.password = undefined;
						res.json({ message: 'logged in successfully..', token, user: saveduser });
					} else {
						return res.status(422).json({ error: 'Invalid Email or Password' });
					}
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
});

router.put('/createUser', adminauth, (req, res) => {
	const { username, password, email, usertype, bundles, campaigns } = req.body;
	if (!username || !password || !email || !usertype) {
		return res.status(422).json({ error: 'Enter the all required fields' });
	}
	admin.findOne({ email: email }).then((oneofuser) => {
		if (oneofuser) {
			if (oneofuser.usertype === usertype) {
				return res.json({ error: 'User Already Exist' });
			}
		}
		bcrypt
			.hash(password, 12)
			.then((hashpass) => {
				const adminU = new admin({
					username,
					password: hashpass,
					email,
					usertype,
					bundles,
					campaigns
				});
				adminU
					.save()
					.then((savedAdmin) => {
						res.json({ message: 'User saved Successfully...' });
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	});
});

router.get('/users', adminauth, (req, res) => {
	// if(req.user.usertype !== 'admin'){
	//     return res.json({message:'You Should be an admin'})
	// }
	admin
		.find()
		.select('-password')
		.then((erre) => {
			res.json(erre);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/id/:id', adminauth, (req, res) => {
	// if(req.user.usertype !== 'admin'){
	//     return res.json({message:'You Should be an admin'})
	// }
	admin
		.findOne({ _id: req.params.id })
		.select('-password')
		.then((erre) => {
			res.json(erre);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/loggedUser', adminauth, (req, res, next) => {
	var data = res.locals.user;
	// console.log(data)
	res.json(data);
});

router.put('/addbundleOrcampaigns', adminauth, (req, res) => {
	const { id, campaigns, bundles } = req.body;
	// console.log(req.body);
	admin
		.findOne({ _id: id })
		.then((user) => {
			console.log(user);
			var setcamp = [ ...new Set(campaigns) ];
			user.campaigns = setcamp;
			var setbund = [ ...new Set(bundles) ];
			user.bundles = setbund;
			user
				.save()
				.then((respo) => {
					res.json({ message: 'Updated Successfully', user: respo });
				})
				.catch((err) => {
					console.log(err);
					return res.status(400).json({ error: 'error occured..', err: err });
				});
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({ error: 'error occured..', err: err });
		});
});

router.delete('/deleteUser', adminauth, (req, res) => {
	const { username } = req.body;
	admin
		.deleteOne({ username: username })
		.then((repo) => {
			res.json({ message: 'User Deleted successfully' });
		})
		.catch((err) => res.status(422).json(err));
});

module.exports = router;
