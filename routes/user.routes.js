const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const admin = mongoose.model('admin');
const campaignClient = mongoose.model('campaignClient');
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

router.get('/campaigns/:id', adminauth, (req, res) => {
	const { id } = req.params;
	campaignClient.find({ userid: id }).then((result) => res.json(result)).catch((err) => {
		console.log(err);
		res.status(404).json({ error: 'somthing went wrong', err });
	});
});

router.post('/addCampaign', adminauth, async (req, res) => {
	const {
		userid,
		searchName,
		endDate,
		PricingModel,
		startDate,
		type,
		campaignName,
		audio,
		display,
		video,
		podcast,
		onDemand,
		musicapps
	} = req.body;
	if (
		!userid ||
		!searchName ||
		!endDate ||
		!startDate ||
		!PricingModel ||
		!type ||
		!campaignName ||
		!audio ||
		!display ||
		!video ||
		!podcast ||
		!onDemand
	) {
		res.status(422).json({ error: 'enter all the required fields' });
	}
	let existCamp = await campaignClient
		.find({ userid: userid, searchName: searchName })
		.catch((err) => console.log(err));
	if (existCamp && existCamp.length > 0) {
		return res.status(422).json({ error: 'Campaign already exists to this client' });
	}
	const campaign = new campaignClient({
		userid: userid,
		campaignName: campaignName,
		searchName: searchName,
		type: type,
		startDate,
		endDate,
		PricingModel,
		audio,
		display,
		video,
		musicapps,
		podcast,
		onDemand
	});
	let result = await campaign.save().catch((err) => {
		res.status(404).json({ error: 'something went wrong', err });
		console.log(err);
	});
	if (result) {
		res.json({ message: 'Campaign successfully added', result });
	} else {
		res.status(404).json({ error: 'something went wrong' });
	}
});

router.put('/editcampaign', adminauth, async (req, res) => {
	const {
		userid,
		searchName,
		campaignName,
		endDate,
		PricingModel,
		startDate,
		audio,
		display,
		video,
		podcast,
		onDemand,
		musicapps
	} = req.body;
	if (!searchName || !userid) {
		res.status(422).json({ error: 'enter all the required fields' });
	}
	let campaign = await campaignClient.findOne({ userid: userid, searchName: searchName }).catch((err) => {
		res.status(404).json({ error: 'something went wrong', err });
		console.log(err);
	});
	if (campaignName) {
		campaign.campaignName = campaignName;
	}
	if (endDate) {
		campaign.endDate = endDate;
	}
	if (startDate) {
		campaign.startDate = startDate;
	}
	if (PricingModel) {
		campaign.PricingModel = PricingModel;
	}
	if (audio) {
		campaign.audio = audio;
	}
	if (display) {
		campaign.display = display;
	}
	if (video) {
		campaign.video = video;
	}
	if (musicapps) {
		campaign.musicapps = musicapps;
	}
	if (podcast) {
		campaign.podcast = podcast;
	}
	if (onDemand) {
		campaign.onDemand = onDemand;
	}
	campaign
		.save()
		.then((result) => {
			res.json({ message: 'campaign successfully updated', result });
		})
		.catch((err) => {
			res.status(404).json({ error: 'something went wrong', err });
			console.log(err);
		});
});

router.delete('/deletecampaign', adminauth, (req, res) => {
	const { id } = req.body;
	campaignClient
		.findByIdAndDelete(id)
		.then((resu) => res.json({ message: 'campagin deleted successfully' }))
		.catch((err) => {
			res.status(404).json({ error: 'something went wrong', err });
			console.log(err);
		});
});

router.put('/createUser', adminauth, (req, res) => {
	const { username, password, email, usertype } = req.body;
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
					usertype
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
	if (!id || !campaigns || !bundles) {
		return res.status(422).json({ error: 'Enter all the required details' });
	}
	admin
		.findOne({ _id: id })
		.then((user) => {
			if (!user) {
				return res.status(422).json({ error: 'USer Not found' });
			}
			// console.log(user);
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
