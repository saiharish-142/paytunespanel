import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import PublisherAdmin from './PublisherAdmin';
import QuartilePublisher from './QuartilePub';
// import LanguagePro from './LanguageAdmin';
import PhoneModelAdmin from './PhoneModelAdmin';
import FrequencyAdmin from './frequencyAdmin';
import IbaReportAdmin from './ibaReportAdmin';
import PincodeAdmin from './pincodeAdmin';
import Creative_Report from './creative_report';
import Episode_Report from './podcastepisode';
// import { ExcelSheet, ExcelFile, ExcelColumn } from 'react-data-export';
import ReactExport from 'react-data-export';
import {
	FrequencyBody,
	FrequencyHead,
	IBABody,
	IBAHead,
	PhoneModelBody,
	PhoneModelHead,
	PublishBody,
	PublishHead,
	QuartileBody,
	QuartileHead,
	PincodeHead,
	PincodeBody,
	CreativeHead,
	CreativeBody,
	PodcastBody,
	PodcastHead
} from './CommonFun';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelSheet.ExcelColumn;

// import ExcelColumn from 'react-data-export/dist/ExcelPlugin/elements/ExcelColumn';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const labelTags = [ 'audio', 'podcast', 'display', 'video' ];

function TablePro() {
	const history = useHistory();
	const classes = useStyles();
	const report = useSelector((state) => state.report);
	const spentdata = useSelector((state) => state.report.spent);
	const stateratio = useSelector((state) => state.ratio.ratio);
	const [ usinr, setusinr ] = useState(74.94715);
	const [ pincodereports, setpincodereports ] = useState({});
	const [ phoneModelReports, setphoneModelReports ] = useState([]);
	const [ ibaReports, setibaReports ] = useState([]);
	const [ frequencyReport, setfrequencyReport ] = useState([]);
	const [ creativereports, setcreative ] = useState([]);
	const [ podcastreports, setpodcastreports ] = useState([]);
	const [ uniqueData, setuniqueData ] = useState({ complete: 0, audio: 0, display: 0, video: 0 });
	const [ uniqueDataPub, setuniqueDataPub ] = useState({ complete: 0, audio: 0, display: 0, video: 0 });
	// const [ languageDownloadA, setlanguageDownloadA ] = useState([]);
	// const [ languageDownloadD, setlanguageDownloadD ] = useState([]);
	// const [ languageDownloadV, setlanguageDownloadV ] = useState([]);
	// const [ creativereports, setcreative ] = useState([]);
	useEffect(
		() => {
			if (stateratio) {
				setusinr(stateratio);
			}
		},
		[ stateratio ]
	);
	// spentdata refresher
	useEffect(
		() => {
			console.log(spentdata);
		},
		[ spentdata ]
	);
	// data puller effect
	useEffect(
		() => {
			if (report && report.ids && report.combine_ids) {
				uniqueSetter(report.ids);
				pincodeDataPuller(report.ids);
				PhoneModelDataPuller(report.ids);
				IbaDataPuller(report.ids);
				FrequencyPuller(report.ids);
				Creativedata(report.combine_ids);
				PodcastData(report.combine_ids);
			}
		},
		[ report ]
	);
	// colorfinder
	const colorfinder = (totaltime, lefttime, tobeimpress, impress) => {
		if (tobeimpress > 0) {
			if (impress <= tobeimpress) {
				if (impress === 0) {
					return 'white';
				}
				if (tobeimpress / totaltime <= impress / lefttime) {
					return 'white';
				}
				if (tobeimpress / totaltime > impress / lefttime) {
					return 'yellow';
				}
			} else {
				return '#ff6666';
			}
		}
	};
	async function uniqueSetter(idsa) {
		console.log(idsa);
		var sets = [ 'audio', 'display', 'video' ];
		var ids = idsa;
		var data = {};
		data['complete'] = 0;
		// console.log(report);
		for (var i = 0; i < sets.length; i++) {
			if (ids[sets[i]].length) {
				console.log(ids[sets[i]]);
				await fetch('/ifas/frequency', {
					method: 'put',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + localStorage.getItem('jwt')
					},
					body: JSON.stringify({
						campaignId: ids[sets[i]]
					})
				})
					.then((res) => res.json())
					.then((result) => {
						console.log(result);
						// setpincodeData(prev=>(...prev,`${sets[i]}`:result))
						data['complete'] += result[0].users ? result[0].users : 0;
						data[sets[i]] = result[0].users;
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
		console.log(data);
		setuniqueData(data);
		// setcategoryDataload(false);
	}
	// pincode data of all data
	const pincodeDataPuller = async (idsa) => {
		// console.log(idsa)
		var data = {};
		if (idsa) {
			var sets = labelTags;
			// var setsdatastat = {};
			// var setsdatastatval = true;
			// sets.forEach((x) => (setsdatastat[x] = { value: true, count: 0 }));
			var ids = idsa;
			for (var i = 0; i < sets.length; i++) {
				if (ids[sets[i]].length) {
					console.log(ids[sets[i]]);
					await fetch('/subrepo/pinbycampidsrawtre', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({
							campaignId: ids[sets[i]]
						})
					})
						.then((res) => res.json())
						.then((result) => {
							console.log(result);
							// setpincodeData(prev=>(...prev,`${sets[i]}`:result))
							data[sets[i]] = result;
							setpincodereports(data);
						})
						.catch((err) => {
							// setpincodeDataerr(true);
							console.log(err);
						});
				}
			}
		}
		setpincodereports(data);
		// if (idsa) {
		// 	fetch('/subrepo/zipbycampidsallcombo', {
		// 		method: 'put',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
		// 		},
		// 		body: JSON.stringify({
		// 			campaignId: idsa
		// 		})
		// 	})
		// 		.then((res) => res.json())
		// 		.then((result) => {
		// 			console.log(result[0]);
		// 			var data = result[0];
		// 			if (data) {
		// 				if (data.audio) {
		// 					data.audio = data.audio.filter((x) => x.impression > 0);
		// 				}
		// 				if (data.display) {
		// 					data.display = data.display.filter((x) => x.impression > 0);
		// 				}
		// 				if (data.video) {
		// 					data.video = data.video.filter((x) => x.impression > 0);
		// 				}
		// 			}
		// 			setpincodereports(data);
		// 		})
		// 		.catch((err) => console.log(err));
		// }
	};
	// phoneModel data of all data
	const PhoneModelDataPuller = async (idsa) => {
		// console.log(idsa)
		var sets = labelTags;
		var data = {};
		if (idsa) {
			var ids = idsa;
			for (var i = 0; i < sets.length; i++) {
				if (ids[sets[i]].length) {
					console.log(ids[sets[i]]);
					await fetch('/subrepo/phoneModelbycampids2', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({
							campaignId: ids[sets[i]]
						})
					})
						.then((res) => res.json())
						.then((result) => {
							console.log(result);
							var dataq = result;
							dataq = dataq.filter((x) => x.impression > 0);
							// if (data) {
							// 	if (data.audio) {
							// 		data.audio = data.audio.filter((x) => x.impression > 0);
							// 	}
							// 	if (data.display) {
							// 		data.display = data.display.filter((x) => x.impression > 0);
							// 	}
							// 	if (data.video) {
							// 		data.video = data.video.filter((x) => x.impression > 0);
							// 	}
							// }
							data[sets[i]] = dataq;
							setphoneModelReports(data);
						})
						.catch((err) => console.log(err));
				}
			}
		}
		// if (idsa) {
		// 	fetch('/subrepo/phoneModelbycampidsallcombo', {
		// 		method: 'put',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
		// 		},
		// 		body: JSON.stringify({
		// 			campaignId: idsa
		// 		})
		// 	})
		// 		.then((res) => res.json())
		// 		.then((result) => {
		// 			console.log(result[0]);
		// 			var data = result[0];
		// 			if (data) {
		// 				if (data.audio) {
		// 					data.audio = data.audio.filter((x) => x.impression > 0);
		// 				}
		// 				if (data.display) {
		// 					data.display = data.display.filter((x) => x.impression > 0);
		// 				}
		// 				if (data.video) {
		// 					data.video = data.video.filter((x) => x.impression > 0);
		// 				}
		// 			}
		// 			setphoneModelReports(data);
		// 		})
		// 		.catch((err) => console.log(err));
		// }
	};
	// iba data of all data
	const IbaDataPuller = async (idsa) => {
		// console.log(idsa)
		var sets = labelTags;
		var data = {};
		var ids = idsa;
		if (idsa) {
			for (var i = 0; i < sets.length; i++) {
				if (ids[sets[i]].length) {
					await fetch('/subrepo/categorywisereportsids', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({
							campaignId: ids[sets[i]]
						})
					})
						.then((res) => res.json())
						.then((result) => {
							console.log(result);
							// console.log(result.audio);
							// console.log(result.display);
							var dataq = result;
							dataq = dataq.filter((x) => x.impressions > 0);
							// if (data) {
							// 	if (data.audio) {
							// 		data.audio = data.audio.filter((x) => x.impressions > 0);
							// 	}
							// 	if (data.display) {
							// 		data.display = data.display.filter((x) => x.impressions > 0);
							// 	}
							// 	if (data.video) {
							// 		data.video = data.video.filter((x) => x.impressions > 0);
							// 	}
							// }
							data[sets[i]] = dataq;
							setibaReports(data);
						})
						.catch((err) => console.log(err));
				}
			}
		}
		// if (idsa) {
		// 	fetch('/subrepo/categorywisereportsallcombo', {
		// 		method: 'put',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
		// 		},
		// 		body: JSON.stringify({
		// 			campaignId: idsa
		// 		})
		// 	})
		// 		.then((res) => res.json())
		// 		.then((result) => {
		// 			console.log(result);
		// 			// console.log(result.audio);
		// 			// console.log(result.display);
		// 			var data = result;
		// 			if (data) {
		// 				if (data.audio) {
		// 					data.audio = data.audio.filter((x) => x.impressions > 0);
		// 				}
		// 				if (data.display) {
		// 					data.display = data.display.filter((x) => x.impressions > 0);
		// 				}
		// 				if (data.video) {
		// 					data.video = data.video.filter((x) => x.impressions > 0);
		// 				}
		// 			}
		// 			setibaReports(data);
		// 		})
		// 		.catch((err) => console.log(err));
		// }
	};
	// iba data of all data
	const FrequencyPuller = async (idsa) => {
		console.log(idsa);
		var sets = labelTags;
		var data = {};
		if (idsa) {
			var ids = idsa;
			for (var i = 0; i < sets.length; i++) {
				if (ids[sets[i]].length) {
					await fetch('/ifas/sumfrequencyids', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({
							campaignId: ids[sets[i]]
						})
					})
						.then((res) => res.json())
						.then((result) => {
							console.log(result);
							var dataq = result;
							dataq = dataq.filter((x) => x.impression > 0);
							data[sets[i]] = dataq;
							setfrequencyReport(data);
						})
						.catch((err) => console.log(err));
				}
			}
		}
		// if (idsa) {
		// 	fetch('/ifas/sumfrequency', {
		// 		method: 'put',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
		// 		},
		// 		body: JSON.stringify({
		// 			campaignId: idsa
		// 		})
		// 	})
		// 		.then((res) => res.json())
		// 		.then((result) => {
		// 			console.log(result);
		// 			var data = result;
		// 			if (data) {
		// 				if (data.audio) {
		// 					data.audio = data.audio.filter((x) => x.impression > 0);
		// 				}
		// 				if (data.display) {
		// 					data.display = data.display.filter((x) => x.impression > 0);
		// 				}
		// 				if (data.video) {
		// 					data.video = data.video.filter((x) => x.impression > 0);
		// 				}
		// 			}
		// 			setfrequencyReport(data);
		// 		})
		// 		.catch((err) => console.log(err));
		// }
	};
	// creative data puller
	const Creativedata = (idsa) => {
		console.log(idsa);
		if (idsa) {
			fetch('/subrepo/creativewisereports', {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt')
				},
				body: JSON.stringify({
					campaignId: idsa
				})
			})
				.then((res) => res.json())
				.then((result) => {
					console.log(result);
					setcreative(result);
				})
				.catch((err) => console.log(err));
		}
	};
	// podcast data puller
	const PodcastData = (idsa) => {
		if (idsa) {
			fetch('/subrepo/podcastepisodereports', {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt')
				},
				body: JSON.stringify({
					campaignId: idsa
				})
			})
				.then((res) => res.json())
				.then((result) => {
					console.log(result);
					setpodcastreports(result);
				})
				.catch((err) => console.log(err));
		}
	};
	// time finder for two date
	const timefinder = (da1, da2) => {
		var d1 = new Date(da1);
		var d2 = new Date(da2);
		if (d1 === d2) {
			return 1;
		}
		if (d1 < d2) {
			return 'completed campaign';
		}
		var show = d1.getTime() - d2.getTime();
		var resula = show / (1000 * 3600 * 24);
		if (Math.round(resula * 1) / 1 === 0) {
			resula = 1;
		}
		return Math.round(resula * 1) / 1;
	};
	// return string formate of date
	const updatedatetimeseter = (date) => {
		// console.log(date)
		// var datee = new Date(date);
		var s = new Date(new Date()).toString();
		// var datee = datee.toString();
		// console.log(s,date,s.split('/'))
		s = s.split(' ');
		// console.log(s);
		return s[2] + '-' + s[1] + '-' + s[3] + ' ' + s[4];
	};
	// returns a good format of date
	const dateformatchanger = (date) => {
		var dategot = date.toString();
		var datechanged = dategot.slice(8, 10) + '-' + dategot.slice(5, 7) + '-' + dategot.slice(0, 4);
		return datechanged;
	};
	// summary table
	const SummaryTable = (title, reportsub) => {
		// console.log({ users, pubusers, sad: 'dasda' });
		return (
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>Overall {title} Report</div>
				{report.req_id && reportsub && report.ids ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								{title === 'Summary' && <TableCell>Campaign Start Date</TableCell>}
								{title === 'Summary' && <TableCell>Campaign End Date</TableCell>}
								{title === 'Summary' && <TableCell>Total Days of Campaign</TableCell>}
								<TableCell>Total Impressions to be delivered</TableCell>
								<TableCell>Total Impressions Delivered till date</TableCell>
								<TableCell>unique User</TableCell>
								<TableCell>Avg Frequency</TableCell>
								<TableCell>% Users Overlap</TableCell>
								<TableCell>Total Clicks Delivered till date</TableCell>
								<TableCell>CTR</TableCell>
								{title != 'Display' && <TableCell>LTR</TableCell>}
								<TableCell>Avg required</TableCell>
								<TableCell>Avg Achieved</TableCell>
								<TableCell>Total spent</TableCell>
								<TableCell>Balance Impressions</TableCell>
								{title === 'Summary' && <TableCell>Balance Days</TableCell>}
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow
								style={{
									background: colorfinder(
										timefinder(report.endDate, report.startDate),
										timefinder(Date.now(), report.startDate),
										reportsub.target,
										reportsub.impressions
									)
								}}
							>
								{title === 'Summary' && <TableCell>{dateformatchanger(report.startDate)}</TableCell>}
								{title === 'Summary' && <TableCell>{dateformatchanger(report.endDate)}</TableCell>}
								{title === 'Summary' && (
									<TableCell>{timefinder(report.endDate, report.startDate)} days</TableCell>
								)}
								<TableCell>{reportsub.target}</TableCell>
								<TableCell>{reportsub.impressions}</TableCell>
								<TableCell>{reportsub.uniqueValue}</TableCell>
								{title === 'Summary' ? (
									<TableCell>{Math.round(reportsub.avefreq * 100) / 100}</TableCell>
								) : (
									<TableCell>
										{Math.round(reportsub.impressions / reportsub.uniqueValue * 100) / 100}
									</TableCell>
								)}
								<TableCell>
									{Math.round(reportsub.pubunique * 100 / reportsub.uniqueValue * 100) / 100}%
								</TableCell>
								<TableCell>{reportsub.clicks}</TableCell>
								<TableCell>
									{Math.round(reportsub.clicks * 100 / reportsub.impressions * 100) / 100}%
								</TableCell>
								{title != 'Display' &&
									(title === 'Summary' && report.report.displayCompleteReport ? (
										<TableCell>{Math.round(reportsub.ltr * 100) / 100}%</TableCell>
									) : (
										<TableCell>
											{Math.round(reportsub.complete * 100 / reportsub.impressions * 100) / 100}%
										</TableCell>
									))}
								<TableCell>
									{Math.round(reportsub.target / timefinder(report.endDate, report.startDate) * 10) /
										10}
								</TableCell>
								<TableCell>
									{Math.round(reportsub.impressions / timefinder(Date.now(), report.startDate) * 10) /
										10}
								</TableCell>
								<TableCell>{Math.round(reportsub.spentValue * 1) / 1}</TableCell>
								<TableCell>{reportsub.target - reportsub.impressions}</TableCell>
								{title === 'Summary' && (
									<TableCell>{timefinder(report.endDate, Date.now())} days</TableCell>
								)}
								<TableCell
									className="mangeads__report"
									onClick={() =>
										history.push(
											`/manageAds/${report.req_id}/${title === 'Summary'
												? 'detailedoverallreport'
												: title === 'Audio'
													? 'detailedoverallaudioreport'
													: title === 'Video'
														? 'detailedoverallvideoreport'
														: 'detailedoveralldisplayreport'}`
										)}
								>
									Detailed Report
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				) : (
					<div style={{ margin: '10px', fontSize: '20px' }}>Loading or No Data Found</div>
				)}
			</TableContainer>
		);
	};
	// spent calculator
	const completespentfider = (camstype) => {
		// console.log(spentdata);
		if (spentdata && spentdata.length) {
			if (camstype === 'audio') {
				var allspentdatareq = spentdata.filter((x) => report.ids.audio.includes(x.campaignId));
				var spent = 0;
				allspentdatareq.map((dat) => {
					spent += parseFloat(dat.totalSpent);
				});
				return spent;
			}
			if (camstype === 'display') {
				var allspentdatareq = spentdata.filter((x) => report.ids.display.includes(x.campaignId));
				var spent = 0;
				allspentdatareq.map((dat) => {
					spent += parseFloat(dat.totalSpent);
				});
				return spent;
			}
			if (camstype === 'video') {
				var allspentdatareq = spentdata.filter((x) => report.ids.video.includes(x.campaignId));
				var spent = 0;
				allspentdatareq.map((dat) => {
					spent += parseFloat(dat.totalSpent);
				});
				return spent;
			}
			if (camstype === 'all') {
				var allspentdatareq = spentdata;
				var spent = 0;
				allspentdatareq.map((dat) => {
					spent += parseFloat(dat.totalSpent);
				});
				return spent;
			}
		} else {
			return 0;
		}
	};
	// spent finder by ids
	const spentfinder = (appId, campaignId, impressions, appbu, text) => {
		// console.log(text);
		if (spentdata != null)
			if (spentdata.length) {
				if (text === 'appid') {
					// Humgama
					if (appId.toString() === '5d10c405844dd970bf41e2af') {
						return parseInt(impressions) * 4.25 / (usinr * 100);
					}
					// Wynk
					if (appId.toString() === '5b2210af504f3097e73e0d8b') {
						return parseInt(impressions) * 10 / (usinr * 100);
					}
					var datarq = spentdata.filter((x) => x.campaignId === campaignId && x.appId === appId);
					var spent = 0;
					// console.log(datarq)
					datarq.map((dat) => {
						spent += parseFloat(dat.totalSpent);
					});
					return null;
				} else if (text === 'apppub') {
					// console.log(appbu);
					// Humgama
					if (appId.toString() === '5d10c405844dd970bf41e2af') {
						return parseInt(impressions) * 4.25 / (usinr * 100);
					}
					// Wynk
					if (appId.toString() === '5b2210af504f3097e73e0d8b') {
						return parseInt(impressions) * 10 / (usinr * 100);
					}
					var datt = spentdata;
					// datt.map((x) => {
					// 	console.log(x.campaignId === campaignId, x.campaignId, campaignId);
					// });
					var datarq = spentdata.filter((x) => x.campaignId === campaignId && x.apppubid === appbu);
					var spent = 0;
					// console.log(datarq);
					datarq.map((dat) => {
						spent += parseFloat(dat.totalSpent);
					});
					return spent;
				}
			}
		return 0;
	};
	// returns arrow of the asecding and other function
	const arrowRetuner = (mode) => {
		if (mode === '1') {
			return <ArrowUpwardRoundedIcon fontSize="small" />;
		} else if (mode === '2') {
			return <ArrowDownwardRoundedIcon fontSize="small" />;
		} else {
			return <ArrowUpwardRoundedIcon fontSize="small" style={{ color: 'lightgrey' }} />;
		}
	};
	const SumReportGen = (title, reportsub, target, users) => {
		return [
			{
				ySteps: 1,
				xSteps: 5,
				columns: [ { title: `${title} Report` } ],
				data: [ [ { value: '' } ] ]
			},
			{
				columns: [
					{ title: 'Campaign Start Date' },
					{ title: 'Campaign End Date' },
					{ title: 'Total Days of Campaign' },
					{ title: 'Total Impressions Delivered till date' },
					{ title: 'Unique User' },
					{ title: 'Average Frequency' },
					{ title: 'Total Clicks Delivered till date' },
					{ title: 'CTR' },
					{ title: 'LTR' }
				],
				data: [
					[
						{ value: dateformatchanger(report.startDate) },
						{ value: dateformatchanger(report.endDate) },
						{ value: timefinder(report.endDate, report.startDate) + 'days' },
						{ value: reportsub.impressions ? reportsub.impressions : 0 },
						{ value: users ? users : 0 },
						{
							value:
								reportsub.impressions / users
									? Math.round(reportsub.impressions / users * 100) / 100
									: 0
						},
						{ value: reportsub.clicks + reportsub.clicks1 ? reportsub.clicks + reportsub.clicks1 : 0 },
						{
							value:
								Math.round((reportsub.clicks + reportsub.clicks1) * 100 / reportsub.impressions * 100) /
									100 +
								'%'
						},
						{ value: Math.round(reportsub.complete * 100 / reportsub.impressions * 100) / 100 + '%' }
					]
				]
			}
		];
	};
	const PublisherProps = {
		singlead: report,
		titleData: report.title && report.title,
		arrowRetuner: arrowRetuner,
		colorfinder: colorfinder,
		timefinder: timefinder,
		ids: report.ids,
		spentdata: spentdata,
		spentfinder: spentfinder,
		spentOffline: report.audiospentOffline ? report.audiospentOffline : 0,
		spentOfflined: report.displayspentOffline ? report.displayspentOffline : 0,
		spentOfflinev: report.videospentOffline ? report.videospentOffline : 0,
		state1: report.req_id
	};
	const OverallDataDown = {
		complete: [
			{
				xSteps: 5,
				columns: [ { title: 'Overall Summery Report' } ],
				data: [ [ { value: '' } ] ]
			},
			{
				columns: [
					{ title: 'Campaign Start Date' },
					{ title: 'Campaign End Date' },
					{ title: 'Total Days of Campaign' },
					{ title: 'Total Impressions to be delivered' },
					{ title: 'Total Impressions Delivered till date' },
					{ title: 'unique User' },
					{ title: 'Avg Frequency' },
					{ title: '% Users Overlap' },
					{ title: 'Total Clicks Delivered till date' },
					{ title: 'CTR' },
					{ title: 'LTR' },
					{ title: 'Avg required' },
					{ title: 'Avg Achieved' },
					{ title: 'Total spent' },
					{ title: 'Balance Impressions' },
					{ title: 'Balance Days' }
				],
				data: [
					[
						{ value: dateformatchanger(report.startDate) },
						{ value: dateformatchanger(report.endDate) },
						{ value: timefinder(report.endDate, report.startDate) + ' days' },
						{
							value: report.report.summaryCompleteReport.target
						},
						{ value: report.report.summaryCompleteReport.impressions },
						{
							value: report.report.summaryCompleteReport.uniqueValue
								? report.report.summaryCompleteReport.uniqueValue
								: 0
						},
						{
							value: Math.round(report.report.summaryCompleteReport.avefreq * 100) / 100
						},
						{
							value:
								Math.round(
									report.report.summaryCompleteReport.pubunique *
										100 /
										report.report.summaryCompleteReport.uniqueValue *
										100
								) / 100
						} + '%',
						{ value: report.report.summaryCompleteReport.clicks },
						{
							value:
								Math.round(
									report.report.summaryCompleteReport.clicks /
										report.report.summaryCompleteReport.impressions *
										100
								) /
									100 +
								'%'
						},
						{ value: report.report.summaryCompleteReport.ltr } + '%',
						{
							value: Math.round(report.report.summaryCompleteReport.avgreq * 10) / 10
						},
						{
							value: Math.round(report.report.summaryCompleteReport.avgach * 10) / 10
						},
						{
							value: report.report.summaryCompleteReport.spentValue
						},
						{
							value:
								report.report.summaryCompleteReport.target -
								report.report.summaryCompleteReport.impressions
						},
						{ value: timefinder(report.endDate, Date.now()) }
					]
				]
			}
		],
		audio:
			report.ids && report.ids.audio && report.ids.audio.length && report.report.musicCompleteReport
				? [
						{
							ySteps: 1,
							xSteps: 5,
							columns: [ { title: 'Audio Wise Summery Report' } ],
							data: [ [ { value: '' } ] ]
						},
						{
							columns: [
								{ title: 'Total Impressions to be delivered' },
								{ title: 'Total Impressions Delivered till date' },
								{ title: 'unique User' },
								{ title: 'Avg Frequency' },
								{ title: '% Users Overlap' },
								{ title: 'Total Clicks Delivered till date' },
								{ title: 'CTR' },
								{ title: 'LTR' },
								{ title: 'Avg required' },
								{ title: 'Avg Achieved' },
								{ title: 'Total spent' },
								{ title: 'Balance Impressions' },
								{ title: 'Balance Days' }
							],
							data: [
								[
									{
										value: report.report.musicCompleteReport.target
									},
									{ value: report.report.musicCompleteReport.impressions },
									{ value: report.report.musicCompleteReport.uniqueValue },
									{
										value: Math.round(
											report.report.musicCompleteReport.impressions /
												report.report.musicCompleteReport.uniqueValue
										)
									},
									{
										value:
											Math.round(
												report.report.musicCompleteReport.pubunique /
													report.report.musicCompleteReport.uniqueValue *
													100
											) / 100
									} + '%',
									{ value: report.report.musicCompleteReport.clicks },
									{
										value:
											Math.round(
												report.report.musicCompleteReport.clicks /
													report.report.musicCompleteReport.impressions *
													100
											) /
												100 +
											'%'
									},
									{
										value:
											Math.round(
												report.report.musicCompleteReport.complete /
													report.report.musicCompleteReport.impressions *
													100
											) /
												100 +
											'%'
									},
									{
										value:
											Math.round(
												report.report.musicCompleteReport.target /
													timefinder(report.endDate, report.startDate) *
													10
											) / 10
									},
									{
										value:
											Math.round(
												report.report.musicCompleteReport.impressions /
													timefinder(Date.now(), report.startDate) *
													10
											) / 10
									},
									{
										value: report.report.musicCompleteReport.spentValue
									},
									{
										value:
											report.report.musicCompleteReport.target -
											report.report.musicCompleteReport.impressions
									},
									{ value: timefinder(report.endDate, Date.now()) }
								]
							]
						}
					]
				: [],
		podcast:
			report.ids && report.ids.audio && report.ids.audio.length && report.report.podcastCompleteReport
				? [
						{
							ySteps: 1,
							xSteps: 5,
							columns: [ { title: 'Podcast Wise Summery Report' } ],
							data: [ [ { value: '' } ] ]
						},
						{
							columns: [
								{ title: 'Total Impressions to be delivered' },
								{ title: 'Total Impressions Delivered till date' },
								{ title: 'unique User' },
								{ title: 'Avg Frequency' },
								{ title: '% Users Overlap' },
								{ title: 'Total Clicks Delivered till date' },
								{ title: 'CTR' },
								{ title: 'LTR' },
								{ title: 'Avg required' },
								{ title: 'Avg Achieved' },
								{ title: 'Total spent' },
								{ title: 'Balance Impressions' },
								{ title: 'Balance Days' }
							],
							data: [
								[
									{
										value: report.report.podcastCompleteReport.target
									},
									{ value: report.report.podcastCompleteReport.impressions },
									{ value: report.report.podcastCompleteReport.uniqueValue },
									{
										value: Math.round(
											report.report.podcastCompleteReport.impressions /
												report.report.podcastCompleteReport.uniqueValue
										)
									},
									{
										value:
											Math.round(
												report.report.podcastCompleteReport.pubunique /
													report.report.podcastCompleteReport.uniqueValue *
													100
											) / 100
									} + '%',
									{ value: report.report.podcastCompleteReport.clicks },
									{
										value:
											Math.round(
												report.report.podcastCompleteReport.clicks /
													report.report.podcastCompleteReport.impressions *
													100
											) /
												100 +
											'%'
									},
									{
										value:
											Math.round(
												report.report.podcastCompleteReport.complete /
													report.report.podcastCompleteReport.impressions *
													100
											) /
												100 +
											'%'
									},
									{
										value:
											Math.round(
												report.report.podcastCompleteReport.target /
													timefinder(report.endDate, report.startDate) *
													10
											) / 10
									},
									{
										value:
											Math.round(
												report.report.podcastCompleteReport.impressions /
													timefinder(Date.now(), report.startDate) *
													10
											) / 10
									},
									{
										value: report.report.podcastCompleteReport.spentValue
									},
									{
										value:
											report.report.podcastCompleteReport.target -
											report.report.podcastCompleteReport.impressions
									},
									{ value: timefinder(report.endDate, Date.now()) }
								]
							]
						}
					]
				: [],
		display:
			report.ids && report.ids.display && report.ids.display.length && report.report.displayCompleteReport
				? [
						{
							ySteps: 1,
							xSteps: 5,
							columns: [ { title: 'Display Wise Summery Report' } ],
							data: [ [ { value: '' } ] ]
						},
						{
							columns: [
								{ title: 'Total Impressions to be delivered' },
								{ title: 'Total Impressions Delivered till date' },
								{ title: 'unique User' },
								{ title: 'Avg Frequency' },
								{ title: '% Users Overlap' },
								{ title: 'Total Clicks Delivered till date' },
								{ title: 'CTR' },
								{ title: 'Avg required' },
								{ title: 'Avg Achieved' },
								{ title: 'Total spent' },
								{ title: 'Balance Impressions' },
								{ title: 'Balance Days' }
							],
							data: [
								[
									{
										value: report.report.displayCompleteReport.target
									},
									{ value: report.report.displayCompleteReport.impressions },
									{ value: report.report.displayCompleteReport.uniqueValue },
									{
										value: Math.round(
											report.report.displayCompleteReport.impressions /
												report.report.displayCompleteReport.uniqueValue
										)
									},
									{
										value:
											Math.round(
												report.report.displayCompleteReport.pubunique /
													report.report.displayCompleteReport.uniqueValue *
													100
											) / 100
									} + '%',
									{ value: report.report.displayCompleteReport.clicks },
									{
										value:
											Math.round(
												report.report.displayCompleteReport.clicks /
													report.report.displayCompleteReport.impressions *
													100
											) /
												100 +
											'%'
									},
									{
										value:
											Math.round(
												report.report.displayCompleteReport.target /
													timefinder(report.endDate, report.startDate) *
													10
											) / 10
									},
									{
										value:
											Math.round(
												report.report.displayCompleteReport.impressions /
													timefinder(Date.now(), report.startDate) *
													10
											) / 10
									},
									{
										value: report.report.displayCompleteReport.spentValue
									},
									{
										value:
											report.report.displayCompleteReport.target -
											report.report.displayCompleteReport.impressions
									},
									{ value: timefinder(report.endDate, Date.now()) }
								]
							]
						}
					]
				: [],
		video:
			report.ids && report.ids.video && report.ids.video.length && report.report.videoCompleteReport
				? [
						{
							ySteps: 1,
							xSteps: 5,
							columns: [ { title: 'Video Wise Summery Report' } ],
							data: [ [ { value: '' } ] ]
						},
						{
							columns: [
								{ title: 'Total Impressions to be delivered' },
								{ title: 'Total Impressions Delivered till date' },
								{ title: 'unique User' },
								{ title: 'Avg Frequency' },
								{ title: '% Users Overlap' },
								{ title: 'Total Clicks Delivered till date' },
								{ title: 'CTR' },
								{ title: 'LTR' },
								{ title: 'Avg required' },
								{ title: 'Avg Achieved' },
								{ title: 'Total spent' },
								{ title: 'Balance Impressions' },
								{ title: 'Balance Days' }
							],
							data: [
								[
									{
										value: report.report.videoCompleteReport.target
									},
									{ value: report.report.videoCompleteReport.impressions },
									{ value: report.report.videoCompleteReport.uniqueValue },
									{
										value: Math.round(
											report.report.videoCompleteReport.impressions /
												report.report.videoCompleteReport.uniqueValue
										)
									},
									{
										value:
											Math.round(
												report.report.videoCompleteReport.pubunique /
													report.report.videoCompleteReport.uniqueValue *
													100
											) / 100
									} + '%',
									{ value: report.report.videoCompleteReport.clicks },
									{
										value:
											Math.round(
												report.report.videoCompleteReport.clicks /
													report.report.videoCompleteReport.impressions *
													100
											) /
												100 +
											'%'
									},
									{
										value:
											Math.round(
												report.report.videoCompleteReport.complete /
													report.report.videoCompleteReport.impressions *
													100
											) /
												100 +
											'%'
									},
									{
										value:
											Math.round(
												report.report.videoCompleteReport.target /
													timefinder(report.endDate, report.startDate) *
													10
											) / 10
									},
									{
										value:
											Math.round(
												report.report.videoCompleteReport.impressions /
													timefinder(Date.now(), report.startDate) *
													10
											) / 10
									},
									{
										value: report.report.videoCompleteReport.spentValue
									},
									{
										value:
											report.report.videoCompleteReport.target -
											report.report.videoCompleteReport.impressions
									},
									{ value: timefinder(report.endDate, Date.now()) }
								]
							]
						}
					]
				: [],
		quartile: [
			{
				ySteps: 1,
				xSteps: 5,
				columns: [ { title: 'Quartile Summery Report' } ],
				data: [ [ { value: '' } ] ]
			},
			{
				columns: [
					{ title: '' },
					{ title: 'Start' },
					{ title: 'First Quartile' },
					{ title: 'Second Quartile' },
					{ title: 'Third Quartile' },
					{ title: 'Complete' },
					{ title: 'Total Impresions' },
					{ title: 'LTR' }
				],
				data: [
					[
						{ value: 'Impressions' },
						{
							value: report.report.summaryCompleteReport.start
								? report.report.summaryCompleteReport.start
								: 0
						},
						{
							value: report.report.summaryCompleteReport.firstQuartile
								? report.report.summaryCompleteReport.firstQuartile
								: 0
						},
						{
							value: report.report.summaryCompleteReport.midpoint
								? report.report.summaryCompleteReport.midpoint
								: 0
						},
						{
							value: report.report.summaryCompleteReport.thirdQuartile
								? report.report.summaryCompleteReport.thirdQuartile
								: 0
						},
						{
							value: report.report.summaryCompleteReport.complete
								? report.report.summaryCompleteReport.complete
								: 0
						},
						{
							value: report.report.summaryCompleteReport.impressions
								? report.report.summaryCompleteReport.impressions
								: 0
						},
						{
							value:
								report.report.summaryCompleteReport.complete /
								report.report.summaryCompleteReport.impressions
									? Math.round(
											report.report.summaryCompleteReport.complete /
												report.report.summaryCompleteReport.impressions *
												100
										) / 100
									: 0
						}
					]
				]
			}
		]
	};
	// const LanguageProps = {
	// 	state1: report.req_id,
	// 	arrowRetuner: arrowRetuner,
	// 	url: 'citylanguagebycampids'
	// };
	// console.log(report.ids && report.ids.audio && report.ids.audio.length && PublishBody('Audio', report.report.audio));
	const PublisherDown = {
		audio: [
			{
				columns: PublishHead,
				data:
					report.ids && report.ids.audio && report.ids.audio.length
						? PublishBody('Audio', report.report.music, spentfinder, report)
						: null
			}
		],
		podcast: [
			{
				columns: PublishHead,
				data:
					report.ids && report.ids.audio && report.ids.audio.length
						? PublishBody('Podcast', report.report.podcast, spentfinder, report)
						: null
			}
		],
		display: [
			{
				columns: PublishHead,
				data:
					report.ids && report.ids.display && report.ids.display.length
						? PublishBody('Display', report.report.display, spentfinder, report)
						: null
			}
		],
		video: [
			{
				columns: PublishHead,
				data:
					report.ids && report.ids.video && report.ids.video.length
						? PublishBody('Video', report.report.video, spentfinder, report)
						: null
			}
		]
	};
	const QuartileDown = {
		audio: [
			{
				columns: QuartileHead,
				data: report.ids && report.ids.audio && report.ids.audio.length && QuartileBody(report.report.music)
			}
		],
		podcast: [
			{
				columns: QuartileHead,
				data: report.ids && report.ids.audio && report.ids.audio.length && QuartileBody(report.report.podcast)
			}
		],
		video: [
			{
				columns: QuartileHead,
				data: report.ids && report.ids.video && report.ids.video.length && QuartileBody(report.report.video)
			}
		]
	};
	// const LanguageDown = {
	// 	audio: [
	// 		{
	// 			columns: LanguageHead,
	// 			data:
	// 				report.ids &&
	// 				report.ids.audio &&
	// 				report.ids.audio.length &&
	// 				languageDownloadA &&
	// 				LanguageBody(languageDownloadA)
	// 		}
	// 	],
	// 	display: [
	// 		{
	// 			columns: LanguageHead,
	// 			data:
	// 				report.ids &&
	// 				report.ids.display &&
	// 				report.ids.display.length &&
	// 				languageDownloadD &&
	// 				LanguageBody(languageDownloadD)
	// 		}
	// 	],
	// 	video: [
	// 		{
	// 			columns: LanguageHead,
	// 			data:
	// 				report.ids &&
	// 				report.ids.video &&
	// 				report.ids.video.length &&
	// 				languageDownloadV &&
	// 				LanguageBody(languageDownloadV)
	// 		}
	// 	]
	// };
	const PhoneModelDown = {
		audio: [
			{
				columns: PhoneModelHead,
				data:
					report.ids &&
					report.ids.audio &&
					report.ids.audio.length &&
					phoneModelReports &&
					phoneModelReports.audio &&
					PhoneModelBody(phoneModelReports.audio)
			}
		],
		podcast: [
			{
				columns: PhoneModelHead,
				data:
					report.ids &&
					report.ids.podcast &&
					report.ids.podcast.length &&
					phoneModelReports &&
					phoneModelReports.podcast &&
					PhoneModelBody(phoneModelReports.podcast)
			}
		],
		display: [
			{
				columns: PhoneModelHead,
				data:
					report.ids &&
					report.ids.display &&
					report.ids.display.length &&
					phoneModelReports &&
					phoneModelReports.display &&
					PhoneModelBody(phoneModelReports.display)
			}
		],
		video: [
			{
				columns: PhoneModelHead,
				data:
					report.ids &&
					report.ids.video &&
					report.ids.video.length &&
					phoneModelReports &&
					phoneModelReports.video &&
					PhoneModelBody(phoneModelReports.video)
			}
		]
	};
	const FrequencyDown = {
		audio: [
			{
				columns: FrequencyHead,
				data:
					report.ids &&
					report.ids.audio &&
					report.ids.audio.length &&
					frequencyReport &&
					frequencyReport.audio &&
					FrequencyBody(frequencyReport.audio)
			}
		],
		podcast: [
			{
				columns: FrequencyHead,
				data:
					report.ids &&
					report.ids.podcast &&
					report.ids.podcast.length &&
					frequencyReport &&
					frequencyReport.podcast &&
					FrequencyBody(frequencyReport.podcast)
			}
		],
		display: [
			{
				columns: FrequencyHead,
				data:
					report.ids &&
					report.ids.display &&
					report.ids.display.length &&
					frequencyReport &&
					frequencyReport.display &&
					FrequencyBody(frequencyReport.display)
			}
		],
		video: [
			{
				columns: FrequencyHead,
				data:
					report.ids &&
					report.ids.video &&
					report.ids.video.length &&
					frequencyReport &&
					frequencyReport.video &&
					FrequencyBody(frequencyReport.video)
			}
		]
	};
	const IBADown = {
		audio: [
			{
				columns: IBAHead,
				data:
					report.ids &&
					report.ids.audio &&
					report.ids.audio.length &&
					ibaReports &&
					ibaReports.audio &&
					IBABody(ibaReports.audio)
			}
		],
		podcast: [
			{
				columns: IBAHead,
				data:
					report.ids &&
					report.ids.podcast &&
					report.ids.podcast.length &&
					ibaReports &&
					ibaReports.podcast &&
					IBABody(ibaReports.podcast)
			}
		],
		display: [
			{
				columns: IBAHead,
				data:
					report.ids &&
					report.ids.display &&
					report.ids.display.length &&
					ibaReports &&
					ibaReports.display &&
					IBABody(ibaReports.display)
			}
		],
		video: [
			{
				columns: IBAHead,
				data:
					report.ids &&
					report.ids.video &&
					report.ids.video.length &&
					ibaReports &&
					ibaReports.video &&
					IBABody(ibaReports.video)
			}
		]
	};
	const PincodeDown = {
		audio: [
			{
				columns: PincodeHead,
				data:
					report.ids && report.ids.audio && report.ids.audio.length && pincodereports && pincodereports.audio
						? PincodeBody(pincodereports.audio)
						: null
			}
		],
		podcast: [
			{
				columns: PincodeHead,
				data:
					report.ids &&
					report.ids.podcast &&
					report.ids.podcast.length &&
					pincodereports &&
					pincodereports.podcast
						? PincodeBody(pincodereports.podcast)
						: null
			}
		],
		display: [
			{
				columns: PincodeHead,
				data:
					report.ids &&
					report.ids.display &&
					report.ids.display.length &&
					pincodereports &&
					pincodereports.display
						? PincodeBody(pincodereports.display)
						: null
			}
		],
		video: [
			{
				columns: PincodeHead,
				data:
					report.ids && report.ids.video && report.ids.video.length && pincodereports && pincodereports.video
						? PincodeBody(pincodereports.video)
						: null
			}
		]
	};
	const CreativeDown = [
		{
			columns: CreativeHead,
			data: report.ids && creativereports && creativereports.length && CreativeBody(creativereports)
		}
	];
	const PodcastDown = [
		{
			columns: PodcastHead,
			data: report.ids && podcastreports && podcastreports.length && PodcastBody(podcastreports)
		}
	];
	const CompeleteSheetGen = () => {
		var vamp = [];
		OverallDataDown.complete.map((x) => vamp.push(x));
		if (report.ids && report.ids.audio && report.ids.audio.length && report.report.musicCompleteReport)
			OverallDataDown.audio.map((x) => vamp.push(x));
		if (report.ids && report.ids.audio && report.ids.audio.length && report.report.podcastCompleteReport)
			OverallDataDown.podcast.map((x) => vamp.push(x));
		if (report.ids && report.ids.display && report.ids.display.length && report.report.displayCompleteReport)
			OverallDataDown.display.map((x) => vamp.push(x));
		// vamp.concat(OverallDataDown.display);
		if (report.ids && report.ids.video && report.ids.video.length && report.report.videoCompleteReport)
			OverallDataDown.video.map((x) => vamp.push(x));
		// vamp.concat(OverallDataDown.video);
		// console.log(vamp);
		OverallDataDown.quartile.map((x) => vamp.push(x));
		return vamp;
	};
	// const manu = CompeleteSheetGen();
	// console.log(manu);
	function ExeclDownload(props) {
		// console.log(props);
		const data = React.Children.map(props.children, (child) => {
			// console.log(child);
			if (child.props.dataSet && child.props.dataSet[0].data) {
				return child;
			} else {
				// console.log(child);
			}
		});
		// console.log(data);
		// console.log(data);
		return (
			<ExcelFile
				filename={props.filename}
				element={
					<Button variant="outlined" color="primary">
						Download Tables
					</Button>
				}
			>
				{/* <ExcelSheet dataSet={OverallDataDown.complete} name="Over all Summary Data" /> */}
				{data.map((child) => {
					return child;
				})}
			</ExcelFile>
		);
	}
	return (
		<div>
			<div className="titleReport">{report.title && report.title.toUpperCase()} Campaign</div>
			<div className="titleReport">Overall Summary Report</div>
			{/* <ExcelFile
				filename={'Small Tables'}
				element={
					<Button variant="outlined" color="primary">
						Download ST
					</Button>
				}
			>
				<ExcelSheet dataSet={CompeleteSheetGen()} name="21" />
			</ExcelFile> */}
			<ExeclDownload filename={`Complete Report ${report.title}`}>
				<ExcelSheet dataSet={CompeleteSheetGen()} must={true} name="Over all Summary Data" />
				<ExcelSheet dataSet={PublisherDown.audio} name="Publisher Audio Wise" />
				<ExcelSheet dataSet={PublisherDown.podcast} name="Publisher Podcast Wise" />
				<ExcelSheet dataSet={PublisherDown.display} name="Publisher Display Wise" />
				<ExcelSheet dataSet={PublisherDown.video} name="Publisher Video Wise" />
				<ExcelSheet dataSet={QuartileDown.audio} name="Quartile Audio Wise" />
				<ExcelSheet dataSet={QuartileDown.podcast} name="Quartile Podcast Wise" />
				<ExcelSheet dataSet={QuartileDown.video} name="Quartile Video Wise" />
				<ExcelSheet dataSet={PhoneModelDown.audio} name="PhoneModel Audio Wise" />
				<ExcelSheet dataSet={PhoneModelDown.podcast} name="PhoneModel Podcast Wise" />
				<ExcelSheet dataSet={PhoneModelDown.display} name="PhoneModel Display Wise" />
				<ExcelSheet dataSet={PhoneModelDown.video} name="PhoneModel Video Wise" />
				<ExcelSheet dataSet={FrequencyDown.audio} name="Frequency Audio Wise" />
				<ExcelSheet dataSet={FrequencyDown.podcast} name="Frequency Podcast Wise" />
				<ExcelSheet dataSet={FrequencyDown.display} name="Frequency Display Wise" />
				<ExcelSheet dataSet={FrequencyDown.video} name="Frequency Video Wise" />
				<ExcelSheet dataSet={IBADown.audio} name="Category Audio Wise" />
				<ExcelSheet dataSet={IBADown.podcast} name="Category Podcast Wise" />
				<ExcelSheet dataSet={IBADown.display} name="Category Display Wise" />
				<ExcelSheet dataSet={IBADown.video} name="Category Video Wise" />
				<ExcelSheet dataSet={PincodeDown.audio} name="Pincode Audio Wise" />
				<ExcelSheet dataSet={PincodeDown.podcast} name="Pincode Podcast Wise" />
				<ExcelSheet dataSet={PincodeDown.display} name="Pincode Display Wise" />
				<ExcelSheet dataSet={PincodeDown.video} name="Pincode Video Wise" />
				<ExcelSheet dataSet={CreativeDown} name="Creative Wise" />
				<ExcelSheet dataSet={PodcastDown} name="Podcast Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{SummaryTable('Summary', report.report.summaryCompleteReport)}
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				report.report.musicCompleteReport && SummaryTable('Audio', report.report.musicCompleteReport)
			) : (
				''
			)}
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				report.report.podcastCompleteReport && SummaryTable('Podcast', report.report.podcastCompleteReport)
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				report.report.displayCompleteReport && SummaryTable('Display', report.report.displayCompleteReport)
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				report.report.videoCompleteReport && SummaryTable('Video', report.report.videoCompleteReport)
			) : (
				''
			)}
			<div className="titleReport">Publisher Report</div>
			<ExeclDownload filename={`Publisher Wise Report ${report.title}`}>
				<ExcelSheet dataSet={PublisherDown.audio} name="Audio Wise" />
				<ExcelSheet dataSet={PublisherDown.podcast} name="Podcast Wise" />
				<ExcelSheet dataSet={PublisherDown.display} name="Display Wise" />
				<ExcelSheet dataSet={PublisherDown.video} name="Video Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				<PublisherAdmin {...PublisherProps} title="Audio" report={report.report.music && report.report.music} />
			) : (
				''
			)}
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				<PublisherAdmin
					{...PublisherProps}
					title="Podcast"
					report={report.report.podcast && report.report.podcast}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				<PublisherAdmin
					{...PublisherProps}
					title="Display"
					report={report.report.display && report.report.display}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				<PublisherAdmin {...PublisherProps} title="Video" report={report.report.video && report.report.video} />
			) : (
				''
			)}
			<div className="titleReport">Quartile Summary Report</div>
			<ExeclDownload filename={`Quartile Wise Report ${report.title}`}>
				<ExcelSheet dataSet={QuartileDown.audio} name="Audio Wise" />
				<ExcelSheet dataSet={QuartileDown.podcast} name="Podcast Wise" />
				<ExcelSheet dataSet={QuartileDown.video} name="Video Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Start</TableCell>
							<TableCell>First Quartile</TableCell>
							<TableCell>Second Quartile</TableCell>
							<TableCell>Third Quartile</TableCell>
							<TableCell>Complete</TableCell>
							<TableCell>Total Impresions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>Impressions</TableCell>
							<TableCell>{report.report.summaryCompleteReport.start}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.firstQuartile}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.midpoint}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.thirdQuartile}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.complete}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.impressions}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>Publisher Wise</div>
				{report.ids && report.ids.audio && report.ids.audio.length ? (
					<QuartilePublisher
						title="Audio"
						report={report.report.music && report.report.music}
						arrowRetuner={arrowRetuner}
						ids={report.ids}
						state1={report.req_id}
					/>
				) : (
					''
				)}
				{report.ids && report.ids.audio && report.ids.audio.length ? (
					<QuartilePublisher
						title="Podcast"
						report={report.report.podcast && report.report.podcast}
						arrowRetuner={arrowRetuner}
						ids={report.ids}
						state1={report.req_id}
					/>
				) : (
					''
				)}
				{report.ids && report.ids.video && report.ids.video.length ? (
					<QuartilePublisher
						title="Video"
						report={report.report.video && report.report.video}
						arrowRetuner={arrowRetuner}
						ids={report.ids}
						state1={report.req_id}
					/>
				) : (
					''
				)}
			</TableContainer>
			<div className="titleReport">Phone Make Model Wise Summary Report</div>
			<ExeclDownload filename={`Phone Make Model Wise Report ${report.title}`}>
				<ExcelSheet dataSet={PhoneModelDown.audio} name="Audio Wise" />
				<ExcelSheet dataSet={PhoneModelDown.podcast} name="Podcast Wise" />
				<ExcelSheet dataSet={PhoneModelDown.display} name="Display Wise" />
				<ExcelSheet dataSet={PhoneModelDown.video} name="Video Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				phoneModelReports &&
				phoneModelReports.audio && (
					<PhoneModelAdmin
						title="Audio"
						state1={report.req_id}
						arrowRetuner={arrowRetuner}
						report={phoneModelReports && phoneModelReports.audio}
					/>
				)
			) : (
				''
			)}
			{report.ids && report.ids.podcast && report.ids.podcast.length ? (
				phoneModelReports &&
				phoneModelReports.podcast && (
					<PhoneModelAdmin
						title="Podcast"
						state1={report.req_id}
						arrowRetuner={arrowRetuner}
						report={phoneModelReports && phoneModelReports.podcast}
					/>
				)
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				phoneModelReports &&
				phoneModelReports.display && (
					<PhoneModelAdmin
						title="Display"
						state1={report.req_id}
						arrowRetuner={arrowRetuner}
						report={phoneModelReports && phoneModelReports.display}
					/>
				)
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				phoneModelReports &&
				phoneModelReports.video && (
					<PhoneModelAdmin
						title="Video"
						state1={report.req_id}
						arrowRetuner={arrowRetuner}
						report={phoneModelReports && phoneModelReports.video}
					/>
				)
			) : (
				''
			)}
			<div className="titleReport">Frequency Report</div>
			<ExeclDownload filename={`Frequency Wise Report ${report.title}`}>
				<ExcelSheet dataSet={FrequencyDown.audio} name="Audio Wise" />
				<ExcelSheet dataSet={FrequencyDown.podcast} name="Podcast Wise" />
				<ExcelSheet dataSet={FrequencyDown.display} name="Display Wise" />
				<ExcelSheet dataSet={FrequencyDown.video} name="Video Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				<FrequencyAdmin
					title="Audio"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={frequencyReport && frequencyReport.audio}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.podcast && report.ids.podcast.length ? (
				<FrequencyAdmin
					title="Podcast"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={frequencyReport && frequencyReport.podcast}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				<FrequencyAdmin
					title="Display"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={frequencyReport && frequencyReport.display}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				<FrequencyAdmin
					title="Video"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={frequencyReport && frequencyReport.video}
				/>
			) : (
				''
			)}
			<div className="titleReport">Category Wise Summary Report</div>
			<ExeclDownload filename={`Category Wise Report ${report.title}`}>
				<ExcelSheet dataSet={IBADown.audio} name="Audio Wise" />
				<ExcelSheet dataSet={IBADown.podcast} name="Podcast Wise" />
				<ExcelSheet dataSet={IBADown.display} name="Display Wise" />
				<ExcelSheet dataSet={IBADown.video} name="Video Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				<IbaReportAdmin
					title="Audio"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={ibaReports && ibaReports.audio}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.podcast && report.ids.podcast.length ? (
				<IbaReportAdmin
					title="Podcast"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={ibaReports && ibaReports.podcast}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				<IbaReportAdmin
					title="Display"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={ibaReports && ibaReports.display}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				<IbaReportAdmin
					title="Video"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={ibaReports && ibaReports.video}
				/>
			) : (
				''
			)}
			<div className="titleReport">Pincode Wise Summary Report</div>
			<ExeclDownload filename={`Pincode Wise Report ${report.title}`}>
				<ExcelSheet dataSet={PincodeDown.audio} name="Audio Wise" />
				<ExcelSheet dataSet={PincodeDown.podcast} name="Podcast Wise" />
				<ExcelSheet dataSet={PincodeDown.display} name="Display Wise" />
				<ExcelSheet dataSet={PincodeDown.video} name="Video Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				<PincodeAdmin
					title="Audio"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={pincodereports && pincodereports.audio}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.podcast && report.ids.podcast.length ? (
				<PincodeAdmin
					title="Podcast"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={pincodereports && pincodereports.podcast}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				<PincodeAdmin
					title="Display"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={pincodereports && pincodereports.display}
				/>
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				<PincodeAdmin
					title="Video"
					state1={report.req_id}
					arrowRetuner={arrowRetuner}
					report={pincodereports && pincodereports.video}
				/>
			) : (
				''
			)}
			<div className="titleReport">Podcast Episode Wise Report</div>
			<ExeclDownload filename={`Podcast Episode Wise Report ${report.title}`}>
				<ExcelSheet dataSet={CreativeDown} name="Podcast Report" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			<Episode_Report
				// title="Audio"
				state1={report.req_id}
				arrowRetuner={arrowRetuner}
				report={podcastreports}
			/>
			<div className="titleReport">Creative Wise Summary Report</div>
			<ExeclDownload filename={`Creative Wise Report ${report.title}`}>
				<ExcelSheet dataSet={CreativeDown} name="Creative Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			<Creative_Report
				// title="Audio"
				state1={report.req_id}
				arrowRetuner={arrowRetuner}
				report={creativereports}
			/>
		</div>
	);
}

export default TablePro;
