var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const adminauth = require('../authenMiddleware/adminauth');
const apppublishers = mongoose.model('apppublishers');

router.get('/', adminauth, (req, res) => {
	apppublishers
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => console.log(err));
});

router.post('/addtitle', adminauth, (req, res) => {
	const { title, id } = req.body;
	if (!title || !id) {
		res.status(422).json({ error: 'Enter all the required fields' });
	}
	apppublishers
		.findById(id)
		.then((result) => {
			if (result) {
				result.title = title;
				result
					.save()
					.then((resu) => {
						res.json({ result: resu, message: 'Updated title' });
					})
					.catch((err) => {
						res.status(422).json({ error: 'Error Occured...!' });
					});
			} else {
				res.status(422).json({ error: 'Error Occured...!' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(422).json({ error: 'Error Occured...!', err });
		});
});

module.exports = router;
