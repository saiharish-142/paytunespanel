const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminauth = require('../authenMiddleware/adminauth');
const bindstreamingads = mongoose.model('bindstreamingads');
const streamingads = mongoose.model('streamingads');
const adsetting = mongoose.model('adsetting');

router.get('/', adminauth, (req, res) => {
	bindstreamingads
		.find()
		.populate('ids', '_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
		.then(async (result) => {
			res.json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(422).json({ error: 'Error occured....!', err });
		});
});

router.get('/names', adminauth, (req, res) => {
	bindstreamingads
		.find({}, { _id: 1, bundleadtitle: 1 })
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json({ error: 'Error occured....!', err }));
});

router.get('/:id', adminauth, (req, res) => {
	const { id } = req.params;
	bindstreamingads
		.findById(id)
		.populate('ids', '_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json({ error: 'Error occured....!', err }));
});

router.get('/bundlesClient', adminauth, (req, res) => {
	if (req.user.usertype !== 'admin') {
		return res.status(401).json({ message: 'Not authorized' });
	}
	bindstreamingads
		.find({ _id: { $in: req.user.bundles } })
		.populate('ids', '_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
		.then(async (result) => {
			res.json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(422).json({ error: 'Error occured....!', err });
		});
});

function arr_diff(a1, a2) {
	var a = [],
		diff = [];
	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			delete a[a2[i]];
		} else {
			a[a2[i]] = true;
		}
	}
	for (var k in a) {
		diff.push(k);
	}
	return diff;
}

const removeDuplicates = (inputArray) => {
	const ids = [];
	return inputArray.reduce((sum, element) => {
		if (!ids.includes(element.toString())) {
			sum.push(element);
			ids.push(element.toString());
		}
		return sum;
	}, []);
};

router.get('/grp/:id', adminauth, (req, res) => {
	const { id } = req.params;
	bindstreamingads
		.findById(id)
		.then(async (result) => {
			var data = {
				ids: [],
				id_final: {},
				_id: 0,
				Category: '',
				Advertiser: '',
				bundleadtitle: '',
				Pricing: '',
				PricingModel: '',
				startDate: '',
				endDate: ''
			};
			data.id_final = { audio: [], audimpression: 0, display: [], disimpression: 0, video: [], vidimpression: 0 };
			data.ids = result.ids;
			data._id = result._id;
			data.Category = result.Category;
			data.Advertiser = result.Advertiser;
			data.bundleadtitle = result.bundleadtitle;
			data.Pricing = result.Pricing;
			data.PricingModel = result.PricingModel;
			data.startDate = result.startDate;
			data.endDate = result.endDate;
			data.idsTar = [];
			data.id_spliter = [];
			var ids =
				typeof campaignId !== 'undefined' && typeof campaignId !== 'string' && typeof campaignId !== 'object'
					? data.ids.map((id) => mongoose.Types.ObjectId(id))
					: data.ids;
			let groupedIdsTitle = await streamingads
				.aggregate([
					{ $match: { _id: { $in: ids } } },
					{
						$project: {
							AdTitle: { $toLower: '$AdTitle' }
						}
					},
					{
						$project: {
							AdTitle: { $split: [ '$AdTitle', '_' ] }
						}
					},
					{
						$project: {
							AdTitle: { $slice: [ '$AdTitle', 2 ] }
						}
					},
					{
						$project: {
							AdTitle: {
								$reduce: {
									input: '$AdTitle',
									initialValue: '',
									in: {
										$concat: [
											'$$value',
											{ $cond: [ { $eq: [ '$$value', '' ] }, '', '_' ] },
											'$$this'
										]
									}
								}
							}
						}
					},
					{ $sort: { createdOn: -1 } },
					{
						$group: {
							_id: '$AdTitle'
						}
					},
					{
						$project: {
							Adtitle: '$_id'
						}
					},
					{ $sort: { createdOn: -1 } }
				])
				.catch((err) => console.log(err));
			data.groupedTitles = groupedIdsTitle;
			// let idsTar = await streamingads.find({_id:{$in:ids}},{_id:1,TargetImpressions:1}).catch(err=>console.log(err))
			let id_spliter = await adsetting
				.find({ campaignId: { $in: ids } }, { campaignId: 1, type: 1, targetImpression: 1 })
				.catch((err) => console.log(err));
			data.id_spliter = id_spliter;
			var audio = id_spliter.filter((x) => x.type === 'audio');
			var display = id_spliter.filter((x) => x.type === 'display');
			var video = id_spliter.filter((x) => x.type === 'video');
			var selectedId = [];
			audio.map((x) => {
				data.id_final.audio.push(x.campaignId);
				selectedId.push(x.campaignId);
				data.id_final.audimpression += parseInt(x.targetImpression);
			});
			display.map((x) => {
				data.id_final.display.push(x.campaignId);
				selectedId.push(x.campaignId);
				data.id_final.disimpression += parseInt(x.targetImpression);
			});
			video.map((x) => {
				data.id_final.video.push(x.campaignId);
				selectedId.push(x.campaignId);
				data.id_final.vidimpression += parseInt(x.targetImpression);
			});
			var leftids = arr_diff(ids, selectedId);
			data.leftids = leftids;
			data.id_final.audio.concat(leftids);
			data.id_final.audio = removeDuplicates(data.id_final.audio);
			data.id_final.display = removeDuplicates(data.id_final.display);
			data.id_final.video = removeDuplicates(data.id_final.video);
			res.json(data);
		})
		.catch((err) => res.status(422).json({ error: 'Error occured....!', err }));
});

router.get('/unp/:id', adminauth, (req, res) => {
	const { id } = req.params;
	bindstreamingads
		.findById(id)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json({ error: 'Error occured....!', err }));
});

router.get('/title/:title', adminauth, (req, res) => {
	const { title } = req.params;
	bindstreamingads
		.findOne({ bundleadtitle: title })
		.populate('ids', '_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json({ error: 'Error occured....!', err }));
});

router.post('/createBundle', adminauth, (req, res) => {
	const { Category, Advertiser, bundleadtitle, ids, Pricing, PricingModel, endDate, startDate } = req.body;
	if (!ids || !bundleadtitle || !startDate || !endDate) {
		return res.status(400).json({ error: 'Enter all the Given fields' });
	}
	const somebundle = new bindstreamingads({
		Category,
		Advertiser,
		bundleadtitle,
		ids,
		Pricing,
		PricingModel,
		startDate,
		endDate
	});
	somebundle
		.save()
		.then((result) => {
			res.json({ message: 'saved...!', result });
		})
		.catch((err) => {
			console.log(err);
			return res.status(422).json({ error: 'Error occured....!', err });
		});
});

router.put('/UpdateBundle', adminauth, (req, res) => {
	const { Category, Advertiser, bundleadtitle, id, Pricing, PricingModel, endDate, startDate } = req.body;
	if (!id || !bundleadtitle || !startDate || !endDate) {
		return res.status(400).json({ error: 'Enter all the Given fields' });
	}
	bindstreamingads
		.findByIdAndUpdate(id)
		.then((somebundle) => {
			if (Category) {
				somebundle.Category = Category;
			}
			if (Advertiser) {
				somebundle.Advertiser = Advertiser;
			}
			if (bundleadtitle) {
				somebundle.bundleadtitle = bundleadtitle;
			}
			if (Pricing) {
				somebundle.Pricing = Pricing;
			}
			if (PricingModel) {
				somebundle.PricingModel = PricingModel;
			}
			if (startDate) {
				somebundle.startDate = startDate;
			}
			if (endDate) {
				somebundle.endDate = endDate;
			}
			somebundle
				.save()
				.then((result) => {
					res.json({ message: 'saved...!', result });
				})
				.catch((err) => {
					console.log(err);
					return res.status(422).json({ error: 'Error occured....!', err });
				});
		})
		.catch((err) => {
			console.log(err);
			return res.status(422).json({ error: 'Error occured....!', err });
		});
});

router.put('/addadtobundle', adminauth, (req, res) => {
	const { id, bundleid } = req.body;
	bindstreamingads
		.findByIdAndUpdate(bundleid, { $push: { ids: id } }, { new: true })
		.populate('ids', '_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
		.exec((err, result) => {
			if (err) {
				console.log(err);
				return res.status(422).json({ error: 'Error occured....!', err });
			} else {
				return res.json({ result, message: 'id added...!' });
			}
		});
});

router.put('/removeadtobundle', adminauth, (req, res) => {
	const { id, bundleid } = req.body;
	bindstreamingads
		.findByIdAndUpdate(bundleid, { $pull: { ids: id } }, { new: true })
		.populate('ids', '_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
		.exec((err, result) => {
			if (err) {
				console.log(err);
				return res.status(422).json({ error: 'Error occured....!', err });
			} else {
				return res.json({ result, message: 'id removed...!' });
			}
		});
});

router.delete('/deleteoneBundle', adminauth, (req, res) => {
	const { id } = req.body;
	bindstreamingads.findByIdAndDelete(id).exec((err, result) => {
		if (err) {
			console.log(err);
			return res.status(422).json({ error: 'Error occurred', err });
		} else {
			res.json({ message: 'Deleted successfully...!', result });
		}
	});
});

router.delete('/deleteallbundles', adminauth, (req, res) => {
	bindstreamingads.deleteMany().exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: 'Error occured....!', err });
		} else {
			return res.json({ message: '' });
		}
	});
});

module.exports = router;
