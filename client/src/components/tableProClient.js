import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import PublisherAdmin from './PublisherAdmin';
import PhoneModelAdmin from './PhoneModelAdmin';
import FrequencyAdmin from './frequencyAdmin';
import PincodeAdmin from './pincodeAdmin';
import Creative_Report from './creative_report';
// import { ExcelSheet, ExcelFile, ExcelColumn } from 'react-data-export';
import ReactExport from 'react-data-export';
import {
	FrequencyBody,
	FrequencyHead,
	PhoneModelBody,
	PhoneModelHead,
	PublishBody,
	PublishHead,
	PincodeHead,
	PincodeBody,
	CreativeHead,
	CreativeBody
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

function TableProClient() {
	const history = useHistory();
	const classes = useStyles();
	const report = useSelector((state) => state.report);
	const spentdata = useSelector((state) => state.report.spent);
	const stateratio = useSelector((state) => state.ratio.ratio);
	const [ usinr, setusinr ] = useState(74.94715);
	const [ pincodereports, setpincodereports ] = useState([]);
	const [ phoneModelReports, setphoneModelReports ] = useState([]);
	const [ frequencyReport, setfrequencyReport ] = useState([]);
	const [ creativereports, setcreative ] = useState([]);
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
	// data puller effect
	useEffect(
		() => {
			if (report && report.ids && report.combine_ids) {
				pincodeDataPuller(report.ids);
				PhoneModelDataPuller(report.ids);
				FrequencyPuller(report.ids);
				Creativedata(report.combine_ids);
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
	// pincode data of all data
	const pincodeDataPuller = (idsa) => {
		// console.log(idsa)
		if (idsa) {
			fetch('/subrepo/zipbycampidsallcombo', {
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
					console.log(result[0]);
					var data = result[0];
					if (data) {
						if (data.audio) {
							data.audio = data.audio.filter((x) => x.impression > 0);
						}
						if (data.display) {
							data.display = data.display.filter((x) => x.impression > 0);
						}
						if (data.video) {
							data.video = data.video.filter((x) => x.impression > 0);
						}
					}
					setpincodereports(data);
				})
				.catch((err) => console.log(err));
		}
	};
	// phoneModel data of all data
	const PhoneModelDataPuller = (idsa) => {
		// console.log(idsa)
		if (idsa) {
			fetch('/subrepo/phoneModelbycampidsallcombo', {
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
					console.log(result[0]);
					var data = result[0];
					if (data) {
						if (data.audio) {
							data.audio = data.audio.filter((x) => x.impression > 0);
						}
						if (data.display) {
							data.display = data.display.filter((x) => x.impression > 0);
						}
						if (data.video) {
							data.video = data.video.filter((x) => x.impression > 0);
						}
					}
					setphoneModelReports(data);
				})
				.catch((err) => console.log(err));
		}
	};
	// iba data of all data
	const FrequencyPuller = (idsa) => {
		console.log(idsa);
		if (idsa) {
			fetch('/ifas/sumfrequency', {
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
					var data = result;
					if (data) {
						if (data.audio) {
							data.audio = data.audio.filter((x) => x.impression > 0);
						}
						if (data.display) {
							data.display = data.display.filter((x) => x.impression > 0);
						}
						if (data.video) {
							data.video = data.video.filter((x) => x.impression > 0);
						}
					}
					setfrequencyReport(data);
				})
				.catch((err) => console.log(err));
		}
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
		var s = new Date(date).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
		s = s.split('/');
		return s[1] + '/' + s[0] + '/' + s[2];
	};
	// returns a good format of date
	const dateformatchanger = (date) => {
		var dategot = date.toString();
		var datechanged = dategot.slice(8, 10) + '-' + dategot.slice(5, 7) + '-' + dategot.slice(0, 4);
		return datechanged;
	};
	// summary table
	const SummaryTable = (title, reportsub, target, spent) => {
		// console.log(spent);
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
								<TableCell>Avg required</TableCell>
								<TableCell>Avg Achieved</TableCell>
								<TableCell>Total spent</TableCell>
								<TableCell>Total Clicks Delivered till date</TableCell>
								<TableCell>CTR</TableCell>
								<TableCell>Balance Impressions</TableCell>
								{title === 'Summary' && <TableCell>Balance Days</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow
								style={{
									background: colorfinder(
										timefinder(report.endDate, report.startDate),
										timefinder(Date.now(), report.startDate),
										target,
										reportsub.impressions
									)
								}}
							>
								{title === 'Summary' && <TableCell>{dateformatchanger(report.startDate)}</TableCell>}
								{title === 'Summary' && <TableCell>{dateformatchanger(report.endDate)}</TableCell>}
								{title === 'Summary' && (
									<TableCell>{timefinder(report.endDate, report.startDate)} days</TableCell>
								)}
								<TableCell>{target}</TableCell>
								<TableCell>{reportsub.impressions}</TableCell>
								<TableCell>
									{Math.round(target / timefinder(report.endDate, report.startDate) * 10) / 10}
								</TableCell>
								<TableCell>
									{Math.round(reportsub.impressions / timefinder(Date.now(), report.startDate) * 10) /
										10}
								</TableCell>
								<TableCell>{Math.round(spent * 1) / 1}</TableCell>
								<TableCell>{reportsub.clicks}</TableCell>
								<TableCell>
									{Math.round(reportsub.clicks * 100 / reportsub.impressions * 100) / 100}%
								</TableCell>
								<TableCell>{target - reportsub.impressions}</TableCell>
								{title === 'Summary' && (
									<TableCell>{timefinder(report.endDate, Date.now())} days</TableCell>
								)}
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
	// const LanguageProps = {
	// 	state1: report.req_id,
	// 	arrowRetuner: arrowRetuner,
	// 	url: 'citylanguagebycampids'
	// };
	// console.log(report.report.audio.length && PublishBody('Audio', report.report.audio));
	const PublisherDown = {
		audio: [
			{
				columns: PublishHead,
				data: report.report.audio.length ? PublishBody('Audio', report.report.audio, spentfinder, report) : null
			}
		],
		display: [
			{
				columns: PublishHead,
				data: report.report.display.length
					? PublishBody('Display', report.report.display, spentfinder, report)
					: null
			}
		],
		video: [
			{
				columns: PublishHead,
				data: report.report.video.length ? PublishBody('Video', report.report.video, spentfinder, report) : null
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
	function ExeclDownload(props) {
		// console.log(props);
		const data = React.Children.map(props.children, (child) => {
			// console.log(child);
			if (child.props.dataSet && child.props.dataSet[0].data) {
				return child;
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
			<ExeclDownload filename={`Complete Report ${report.title}`}>
				<ExcelSheet dataSet={PhoneModelDown.audio} name="PhoneModel Audio Wise" />
				<ExcelSheet dataSet={PhoneModelDown.display} name="PhoneModel Display Wise" />
				<ExcelSheet dataSet={PhoneModelDown.video} name="PhoneModel Video Wise" />
				<ExcelSheet dataSet={FrequencyDown.audio} name="Frequency Audio Wise" />
				<ExcelSheet dataSet={FrequencyDown.display} name="Frequency Display Wise" />
				<ExcelSheet dataSet={FrequencyDown.video} name="Frequency Video Wise" />
				<ExcelSheet dataSet={IBADown.audio} name="Category Audio Wise" />
				<ExcelSheet dataSet={IBADown.display} name="Category Display Wise" />
				<ExcelSheet dataSet={IBADown.video} name="Category Video Wise" />
				<ExcelSheet dataSet={PincodeDown.audio} name="Pincode Audio Wise" />
				<ExcelSheet dataSet={PincodeDown.display} name="Pincode Display Wise" />
				<ExcelSheet dataSet={PincodeDown.video} name="Pincode Video Wise" />
				<ExcelSheet dataSet={CreativeDown} name="Creative Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{SummaryTable(
				'Summary',
				report.report.summaryCompleteReport,
				report.ids && report.ids.audimpression + report.ids.disimpression + report.ids.vidimpression,
				completespentfider('all') +
					(report.audiospentOffline ? parseFloat(report.audiospentOffline) : 0) +
					(report.displayspentOffline ? parseFloat(report.displayspentOffline) : 0) +
					(report.videospentOffline ? parseFloat(report.videospentOffline) : 0)
			)}
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				report.report.audioCompleteReport &&
				SummaryTable(
					'Audio',
					report.report.audioCompleteReport,
					report.ids && report.ids.audimpression,
					completespentfider('audio') + (report.audiospentOffline ? parseFloat(report.audiospentOffline) : 0)
				)
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				report.report.displayCompleteReport &&
				SummaryTable(
					'Display',
					report.report.displayCompleteReport,
					report.ids && report.ids.disimpression,
					completespentfider('display') +
						(report.displayspentOffline ? parseFloat(report.displayspentOffline) : 0)
				)
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				report.report.videoCompleteReport &&
				SummaryTable(
					'Video',
					report.report.videoCompleteReport,
					report.ids && report.ids.vidimpression,
					completespentfider('video') + (report.videospentOffline ? parseFloat(report.videospentOffline) : 0)
				)
			) : (
				''
			)}
			<div className="titleReport">Publisher Report</div>
			<ExeclDownload filename={`Publisher Wise Report ${report.title}`}>
				<ExcelSheet dataSet={PublisherDown.audio} name="Audio Wise" />
				<ExcelSheet dataSet={PublisherDown.display} name="Display Wise" />
				<ExcelSheet dataSet={PublisherDown.video} name="Video Wise" />
			</ExeclDownload>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{report.report.audio.length ? (
				<PublisherAdmin {...PublisherProps} title="Audio" report={report.report.audio && report.report.audio} />
			) : (
				''
			)}
			{report.report.display.length ? (
				<PublisherAdmin
					{...PublisherProps}
					title="Display"
					report={report.report.display && report.report.display}
				/>
			) : (
				''
			)}
			{report.report.video.length ? (
				<PublisherAdmin {...PublisherProps} title="Video" report={report.report.video && report.report.video} />
			) : (
				''
			)}
			<div className="titleReport">Quartile Summary Report</div>
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
							<TableCell>{report.report.summaryCompleteReport.fq}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.sq}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.tq}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.complete}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.impressions}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<div className="titleReport">Phone Make Model Wise Summary Report</div>
			<ExeclDownload filename={`Phone Make Model Wise Report ${report.title}`}>
				<ExcelSheet dataSet={PhoneModelDown.audio} name="Audio Wise" />
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
			<div className="titleReport">Pincode Wise Summary Report</div>
			<ExeclDownload filename={`Pincode Wise Report ${report.title}`}>
				<ExcelSheet dataSet={PincodeDown.audio} name="Audio Wise" />
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

export default TableProClient;
