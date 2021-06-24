export const PublishHead = [
	{ title: 'Publisher' },
	{ title: 'SSP' },
	{ title: 'Tagret Impressions' },
	{ title: 'Impressions Delivered' },
	{ title: 'Total spent' },
	{ title: 'Clicks Delivered' },
	{ title: 'CTR' },
	{ title: 'Feed' }
];
export const QuartileHead = [
	{ title: 'Publisher' },
	{ title: 'impressions' },
	{ title: 'start' },
	{ title: 'firstQuartile' },
	{ title: 'midpoint' },
	{ title: 'thirdQuartile' },
	{ title: 'complete' },
	{ title: 'LTR' }
];
export const LanguageHead = [
	{ title: 'Language' },
	{ title: 'Total Impressions ' },
	{ title: 'Clicks' },
	{ title: 'CTR' }
];
export const PhoneModelHead = [
	{ title: 'Phone Model' },
	{ title: 'Release Month And Year ' },
	{ title: 'Release Cost or MRP' },
	{ title: 'Company Name' },
	{ title: 'Model' },
	{ title: 'Type of Device' },
	{ title: 'Impressions' },
	{ title: 'Clicks' },
	{ title: 'CTR' }
];
export const FrequencyHead = [
	{ title: 'Frequency' },
	{ title: 'Impressions' },
	{ title: 'Distinct Users' },
	{ title: 'Clicks' },
	{ title: 'CTR' }
];
export const IBAHead = [
	{ title: 'Category' },
	{ title: 'Name' },
	{ title: 'Tier 1' },
	{ title: 'Tier 2' },
	{ title: 'Tier 3' },
	{ title: 'Tier 4' },
	{ title: 'Gender Category' },
	{ title: 'Age Category' },
	{ title: 'Impressions' },
	{ title: 'Clicks' },
	{ title: 'CTR' }
];
export const PincodeHead = [
	{ title: 'Pincode' },
	{ title: 'Urban/Rural' },
	{ title: 'Lower Sub City' },
	{ title: 'Subsubcity' },
	{ title: 'City' },
	{ title: 'Grand City' },
	{ title: 'District' },
	{ title: 'State' },
	{ title: 'Grand State' },
	{ title: 'Impressions' },
	{ title: 'Clicks' },
	{ title: 'CTR' }
];
export const CreativeHead = [
	{ title: 'Creative Set' },
	{ title: 'Status' },
	{ title: 'Impressions' },
	{ title: 'Clicks' },
	{ title: 'CTR' }
];
export const PublishBody = (type, report1, spentfinder, report) => {
	var spentOffline = report.audiospentOffline ? report.audiospentOffline : 0;
	var spentOfflined = report.displayspentOffline ? report.displayspentOffline : 0;
	var spentOfflinev = report.videospentOffline ? report.videospentOffline : 0;
	return report1.map((log, index) => {
		var spent =
			spentfinder(log.Publisher._id, log.campaignId._id, log.impressions) +
			parseInt(type === 'Audio' ? (spentOffline ? spentOffline : 0) : 0) +
			parseInt(type === 'Display' ? (spentOfflined ? spentOfflined : 0) : 0) +
			parseInt(type === 'Video' ? (spentOfflinev ? spentOfflinev : 0) : 0);
		return [
			{ value: log.publishername ? log.publishername : '' },
			{ value: log.ssp ? log.ssp : '' },
			{ value: parseInt(log.target) ? parseInt(log.target) : '' },
			{ value: log.impressions ? log.impressions : 0 },
			{ value: spent ? Math.round(spent * 1) / 1 : 0 },
			{ value: log.clicks ? log.clicks : 0 },
			{ value: log.ctr ? Math.round(log.ctr * 100) / 100 + '%' : 0 },
			{
				value: log.feed === '3' ? 'Podcast' : log.feed === '' ? 'Ondemand and Streaming' : ''
			}
		];
	});
};
export const QuartileBody = (report1) => {
	return report1.map((log, index) => {
		log.ltr = (log.complete ? parseInt(log.complete) : 0) * 100 / (log.impressions ? parseInt(log.impressions) : 0);
		return [
			{ value: log.publishername ? log.publishername : '' },
			{ value: log.impressions ? log.impressions : 0 },
			{ value: log.start ? log.start : 0 },
			{ value: log.firstQuartile ? log.firstQuartile : 0 },
			{ value: log.midpoint ? log.midpoint : 0 },
			{ value: log.thirdQuartile ? log.thirdQuartile : 0 },
			{ value: log.complete ? log.complete : 0 },
			{ value: log.ltr ? log.ltr + '%' : 0 }
		];
	});
};
export const LanguageBody = (report1) => {
	return report1.map((log, index) => {
		var impression = log.impression ? parseInt(log.impression) : 0;
		var clicks = log.CompanionClickTracking
			? log.CompanionClickTracking
			: 0 + log.SovClickTracking ? log.SovClickTracking : 0;
		var ctr =
			parseInt(
				log.CompanionClickTracking
					? log.CompanionClickTracking
					: 0 + log.SovClickTracking ? log.SovClickTracking : 0
			) *
			100 /
			parseInt(log.impression ? parseInt(log.impression) : 0);
		return [
			{ value: log.citylanguage ? log.citylanguage : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr : 0 }
		];
	});
};
export const PhoneModelBody = (report1) => {
	return report1.map((log, index) => {
		var phoneModel = log.phoneModel ? log.phoneModel : '';
		var release = log.extra ? log.extra.release : '';
		var cost = log.extra ? log.extra.cost : '';
		var company = log.extra ? log.extra.company : '';
		var model = log.extra ? log.extra.model : '';
		var type = log.extra ? log.extra.type : '';
		var impression = log ? log.impression : 0;
		var clicks = parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking);
		var ctr = log.impression
			? (parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking)) * 100 / log.impression
			: 0;
		return [
			{ value: phoneModel ? phoneModel : '' },
			{ value: release ? release : '' },
			{ value: cost ? cost : '' },
			{ value: company ? company : '' },
			{ value: model ? model : '' },
			{ value: type ? type : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr : 0 }
		];
	});
};
export const FrequencyBody = (report1) => {
	return report1.map((log, index) => {
		var ctr = parseInt(log.click) * 100 / parseInt(log.impression);
		return [
			{ value: log._id ? log._id : '' },
			{ value: log.impression ? log.impression : 0 },
			{ value: log.users ? log.users : 0 },
			{ value: log.click ? log.click : 0 },
			{ value: ctr ? ctr : 0 }
		];
	});
};
export const IBABody = (report1) => {
	return report1.map((log, index) => {
		var category = log._id.category ? log._id.category : '';
		var Name = log.extra_details ? log.extra_details.Name : '';
		var tier1 = log.extra_details ? log.extra_details.tier1 : '';
		var tier2 = log.extra_details ? log.extra_details.tier2 : '';
		var tier3 = log.extra_details ? log.extra_details.tier3 : '';
		var tier4 = log.extra_details ? log.extra_details.tier4 : '';
		var genderCategory = log.extra_details ? log.extra_details.genderCategory : '';
		var AgeCategory = log.extra_details ? log.extra_details.AgeCategory : '';
		var impression = log.impressions ? log.impressions : 0;
		var clicks = parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking);
		var ctr =
			(parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking)) *
			100 /
			(log.impressions ? log.impressions : 0);
		return [
			{ value: category ? category : '' },
			{ value: Name ? Name : '' },
			{ value: tier1 ? tier1 : '' },
			{ value: tier2 ? tier2 : '' },
			{ value: tier3 ? tier3 : '' },
			{ value: tier4 ? tier4 : '' },
			{ value: genderCategory ? genderCategory : '' },
			{ value: AgeCategory ? AgeCategory : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr : 0 }
		];
	});
};
export const PincodeBody = (report1) => {
	return report1.map((log, index) => {
		var clicks = parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking);
		var ctr =
			(parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking)) * 100 / parseInt(log.impression);
		return [
			{ value: log.zip ? log.zip : '' },
			{ value: log.area ? log.area : '' },
			{ value: log.lowersubcity ? log.lowersubcity : '' },
			{ value: log.subcity ? log.subcity : '' },
			{ value: log.city ? log.city : '' },
			{ value: log.grandcity ? log.grandcity : '' },
			{ value: log.district ? log.district : '' },
			{ value: log.state ? log.state : '' },
			{ value: log.grandstate ? log.grandstate : '' },
			{ value: log.impression ? log.impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr : 0 }
		];
	});
};
export const CreativeBody = (report1) => {
	return report1.map((log, index) => {
		var creativeset = log._id.creativeset ? log._id.creativeset : '';
		var impression = log ? log.impression : 0;
		var clicks = parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking);
		var ctr =
			Math.round(
				(parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking)) * 100 / parseInt(log.impression)
			) + '%';
		return [
			{ value: creativeset },
			{ value: log.status ? log.status : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr : 0 }
		];
	});
};
