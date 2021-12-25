import React from 'react';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
export const PublishHead = [
	{ title: 'Publisher' },
	{ title: 'PublisherId' },
	{ title: 'Feed' },
	{ title: 'SSP' },
	{ title: 'Unique Users' },
	{ title: 'Average Frequency' },
	{ title: '% Over lap Users' },
	{ title: 'Tagret Impressions' },
	{ title: 'Impressions Delivered' },
	{ title: 'Total spent' },
	{ title: 'Clicks Delivered' },
	{ title: 'CTR' }
];
export const QuartileHead = [
	{ title: 'Publisher' },
	{ title: 'PublisherId' },
	{ title: 'ssp' },
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
export const PhoneModelClientHead = [
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
export const UserAgentHead = [
	{ title: 'User Agent' },
	{ title: 'Requests' },
	{ title: 'Average Requests' },
	{ title: 'Display Name' }
];
export const IBAClientHead = [ { title: 'Name' }, { title: 'Impressions' }, { title: 'Clicks' }, { title: 'CTR' } ];

export const SumDetClientHead = [
	{ title: 'Date' },
	{ title: 'Impressions' },
	{ title: 'Clicks' },
	{ title: 'CTR' },
	{ title: 'Complete' }
];
export const PincodeHead = [
	{ title: 'Pincode' },
	{ title: 'Urban/Rural' },
	{ title: 'City' },
	{ title: 'Grand City' },
	{ title: 'State' },
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
export const PodcastHead = [
	{ title: 'Episode Name' },
	{ title: 'Publisher Name' },
	{ title: 'Impressions' },
	{ title: 'Clicks' },
	{ title: 'CTR' }
];
export const Consoleheaders = [
	{ title: 'Publisher' },
	{ title: 'SSP' },
	{ title: 'Feed' },
	{ title: 'Unique Users' },
	{ title: 'Average Frequency' },
	{ title: '% Over Lap' },
	{ title: 'Total Impressions Delivered till date' },
	{ title: 'Average Impressions' },
	{ title: 'Total Clicks Delivered till date' },
	{ title: 'CTR' }
];
export const ConsoleheadersAudio = [
	{ title: 'Publisher' },
	{ title: 'SSP' },
	{ title: 'Feed' },
	{ title: 'User Agent' },
	{ title: 'Requests' },
	{ title: 'Average Requests' },
	{ title: 'Unique Users' },
	{ title: 'Average Frequency' },
	{ title: '% Over Lap' },
	{ title: 'Total Impressions Delivered till date' },
	{ title: 'Average Impressions' },
	{ title: 'Total Clicks Delivered till date' },
	{ title: 'CTR' }
];
export const PublishBody = (type, report1, spentfinder, report) => {
	var spentOffline = report.audiospentOffline ? report.audiospentOffline : 0;
	var spentOfflined = report.displayspentOffline ? report.displayspentOffline : 0;
	var spentOfflinev = report.videospentOffline ? report.videospentOffline : 0;
	var uniqea = 0;
	report1.map((x) => (uniqea += x.unique));
	return report1.map((log, index) => {
		var spent =
			spentfinder(log.Publisher._id, log.campaignId._id, log.impressions) +
			parseInt(type === 'Audio' ? (spentOffline ? spentOffline : 0) : 0) +
			parseInt(type === 'Display' ? (spentOfflined ? spentOfflined : 0) : 0) +
			parseInt(type === 'Video' ? (spentOfflinev ? spentOfflinev : 0) : 0);
		return [
			{ value: log.publishername ? log.publishername : '' },
			{ value: log.publisherid ? log.publisherid : '' },

			{
				value: log.feed === '3' ? 'Podcast' : log.feed === '' ? 'Ondemand and Streaming' : ''
			},
			{ value: log.ssp ? log.ssp : '' },
			{ value: log.unique ? log.unique : '' },
			{ value: log.unique ? Math.round(log.impressions / log.unique * 100) / 100 : '' },
			{ value: log.unique ? Math.round(log.unique * 100 / uniqea * 100) / 100 : '' },
			{ value: parseInt(log.target) ? parseInt(log.target) : '' },
			{ value: log.impressions ? log.impressions : 0 },
			{ value: spent ? Math.round(spent * 1) / 1 : 0 },
			{ value: log.clicks ? log.clicks : 0 },
			{ value: log.ctr ? Math.round(log.ctr * 100) / 100 + '%' : 0 }
		];
	});
};
export const QuartileBody = (report1) => {
	return report1.map((log, index) => {
		log.ltr = (log.complete ? parseInt(log.complete) : 0) * 100 / (log.impressions ? parseInt(log.impressions) : 0);
		return [
			{ value: log.publishername ? log.publishername : '' },
			{ value: log.publisherid ? log.publisherid : '' },
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
		var Name = log.extra_details.length !== 0 ? log.extra_details[0].Name : '';
		var tier1 = log.extra_details.length !== 0 ? log.extra_details[0].tier1 : '';
		var tier2 = log.extra_details.length !== 0 ? log.extra_details[0].tier2 : '';
		var tier3 = log.extra_details.length !== 0 ? log.extra_details[0].tier3 : '';
		var tier4 = log.extra_details.length !== 0 ? log.extra_details[0].tier4 : '';
		var genderCategory = log.extra_details.length !== 0 ? log.extra_details[0].genderCategory : '';
		var AgeCategory = log.extra_details.length !== 0 ? log.extra_details[0].AgeCategory : '';
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
		var clicks = parseInt(log.clicks);
		var ctr = parseInt(log.clicks) * 100 / parseInt(log.impression);
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
export const PodcastBody = (report1) => {
	return report1.map((log, index) => {
		var episode = log.episode ? log.episode : '';
		var publishername = log.publishername ? log.publishername : '';
		var impression = log ? log.impressions : 0;
		var clicks = parseInt(log.click);
		var ctr = Math.round(parseInt(log.click) * 100 / parseInt(log.impression)) + '%';
		return [
			{ value: episode },
			{ value: publishername ? publishername : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr : 0 }
		];
	});
};
export const ConsolePhoneBody = (report1) => {
	return report1.map((log, index) => {
		var ctr = log.ctr + '%';
		var uniquef = Math.round(log.impression / log.unique * 100) / 100;
		return [
			{ value: log.publisherName ? log.publisherName : '' },
			{ value: log.ssp ? log.ssp : '' },
			{ value: log.fede ? log.fede : '' },
			{ value: log.unique ? log.unique : '' },
			{ value: uniquef ? uniquef : '' },
			{ value: log.overlap ? log.overlap : 0 + '%' },
			{ value: log.impression ? log.impression : 0 },
			{ value: log.click ? log.click : 0 },
			{ value: ctr ? ctr : 0 + '%' }
		];
	});
};
export const ConsolePhoneBodyAudio = (report1) => {
	return report1.map((log, index) => {
		var ctr = log.ctr + '%';
		var uniquef = Math.round(log.impression / log.unique * 100) / 100;
		return [
			{ value: log.publisherName ? log.publisherName : '' },
			{ value: log.ssp ? log.ssp : '' },
			{ value: log.fede ? log.fede : '' },
			{ value: log.useage ? log.useage : '' },
			{ value: log.req ? log.req : '' },
			{ value: log.avgreq ? log.avgreq : '' },
			{ value: log.unique ? log.unique : '' },
			{ value: uniquef ? uniquef : '' },
			{ value: log.overlap ? log.overlap : 0 + '%' },
			{ value: log.impression ? log.impression : 0 },
			{ value: log.click ? log.click : 0 },
			{ value: ctr ? ctr : 0 + '%' }
		];
	});
};
export const QuartileBodyCon = (report1) => {
	return (
		report1 &&
		report1.map((log, index) => {
			log.ltr =
				(log.complete ? parseInt(log.complete) : 0) * 100 / (log.impressions ? parseInt(log.impressions) : 0);
			var ltr =
				(log.complete ? parseInt(log.complete) : 0) * 100 / (log.impression ? parseInt(log.impression) : 0);
			// console.log(ltr);
			return [
				{ value: log.publisherName ? log.publisherName : '' },
				{ value: log.apppubid ? log.apppubid : '' },
				{ value: log.ssp ? log.ssp : '' },
				{ value: log.impression ? log.impression : 0 },
				{ value: log.start ? log.start : 0 },
				{ value: log.firstQuartile ? log.firstQuartile : 0 },
				{ value: log.midpoint ? log.midpoint : 0 },
				{ value: log.thirdQuartile ? log.thirdQuartile : 0 },
				{ value: log.complete ? log.complete : 0 },
				{ value: ltr ? ltr + '%' : 0 }
			];
		})
	);
};
export const PincodeClientBody = (report1, impressionR, clicksR) => {
	var compimpre = 0;
	var compclick = 0;
	report1.map((x) => {
		compimpre += x.impression;
		compclick += x.clicks;
	});
	return report1.map((log, index) => {
		var impression = Math.trunc(log.impression * impressionR / compimpre);
		var clicks = Math.trunc(log.clicks * clicksR / compclick);
		var ctr = clicks * 100 / impression;
		return [
			{ value: log.zip ? log.zip : '' },
			{ value: log.area ? log.area : '' },
			{ value: log.city ? log.city : '' },
			{ value: log.grandcity ? log.grandcity : '' },
			{ value: log.state ? log.state : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr + '%' : 0 }
		];
	});
};
export const PhoneModelClientBody = (report1, impressionR, clicksR) => {
	var compimpre = 0;
	var compclick = 0;
	report1.map((x) => {
		compimpre += x.impression;
		x.clicks = parseInt(x.CompanionClickTracking) + parseInt(x.SovClickTracking);
		compclick += x.clicks;
	});
	return report1.map((log, index) => {
		var type = log ? log.type : '';
		var impression = log ? Math.trunc(log.impression * impressionR / compimpre) : 0;
		var clicks = Math.trunc(
			(parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking)) * clicksR / compclick
		);
		var ctr = impression ? clicks * 100 / impression : 0;
		return [
			{ value: type ? type : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr + '%' : 0 }
		];
	});
};
export const IBAClientBody = (report1, impressionR, clicksR) => {
	var compimpre = 0;
	var compclick = 0;
	report1.map((x) => {
		compimpre += x.impression;
		compclick += x.clicks;
	});
	return report1.map((log, index) => {
		var Name = log.Name ? log.Name : '';
		var impression = log ? Math.trunc(log.impressions * impressionR / compimpre) : 0;
		var clicks = Math.trunc(
			(parseInt(log.CompanionClickTracking) + parseInt(log.SovClickTracking)) * clicksR / compclick
		);
		var ctr = impression ? clicks * 100 / impression : 0;
		return [
			{ value: Name ? Name : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr + '%' : 0 }
		];
	});
};
export const SumDetClientBody = (report1, impressionR, clicksR) => {
	var compimpre = 0;
	var compclick = 0;
	report1.map((x) => {
		compimpre += parseInt(x.impressions);
		compclick += x.clicks;
	});
	return report1.map((log, index) => {
		var Name = log.date ? log.date : '';
		var impression = log ? Math.trunc(parseInt(log.impressions) * impressionR / compimpre) : 0;
		var clicks = Math.trunc(log.clicks * clicksR / compclick);
		var ctr = impression ? clicks * 100 / impression : 0;
		return [
			{ value: Name ? Name : '' },
			{ value: impression ? impression : 0 },
			{ value: clicks ? clicks : 0 },
			{ value: ctr ? ctr + '%' : 0 }
		];
	});
};
export const UserAgentBody = (report1) => {
	return report1.map((log, index) => {
		return [
			{ value: log.ua ? log.ua : '' },
			{ value: log.requests ? log.requests : 0 },
			{ value: log.avgreq ? Math.round(log.avgreq * 100) / 100 : 0 },
			{ value: log.display ? log.display : '' }
		];
	});
};
export const arrowRetuner = (mode) => {
	if (mode === '1') {
		return <ArrowUpwardRoundedIcon fontSize="small" />;
	} else if (mode === '2') {
		return <ArrowDownwardRoundedIcon fontSize="small" />;
	} else {
		return <ArrowUpwardRoundedIcon fontSize="small" style={{ color: 'lightgrey' }} />;
	}
};
