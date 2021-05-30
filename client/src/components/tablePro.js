import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import PublisherAdmin from './PublisherAdmin';
import QuartilePublisher from './QuartilePub';
import LanguagePro from './LanguageAdmin';
import PhoneModelAdmin from './PhoneModelAdmin';
import FrequencyAdmin from './frequencyAdmin';
import IbaReportAdmin from './ibaReportAdmin';
import PincodeAdmin from './pincodeAdmin';
import Creative_Report from './creative_report';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function TablePro() {
	const history = useHistory();
	const classes = useStyles();
	const report = useSelector((state) => state.report);
	const spentdata = useSelector((state) => state.report.spent);
	const stateratio = useSelector((state) => state.ratio.ratio);
	const [ usinr, setusinr ] = useState(74.94715);
	const [ pincodereports, setpincodereports ] = useState([]);
	const [ phoneModelReports, setphoneModelReports ] = useState([]);
	const [ ibaReports, setibaReports ] = useState([]);
	const [ frequencyReport, setfrequencyReport ] = useState([]);
	const [ creativereports, setcreative ] = useState([]);
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
				IbaDataPuller(report.ids);
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
					setpincodereports(result[0]);
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
					setphoneModelReports(result[0]);
				})
				.catch((err) => console.log(err));
		}
	};
	// iba data of all data
	const IbaDataPuller = (idsa) => {
		// console.log(idsa)
		if (idsa) {
			fetch('/subrepo/categorywisereportsallcombo', {
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
					setibaReports(result);
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
					setfrequencyReport(result);
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
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
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
								<TableCell />
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
								<TableCell
									className="mangeads__report"
									onClick={() => history.push(`/manageAds/${report.req_id}/detailed`)}
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
	const spentfinder = (appId, campaignId, impressions) => {
		if (spentdata.length) {
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
			return spent;
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
		spentfinder: spentfinder,
		spentOffline: report.audiospentOffline ? report.audiospentOffline : 0,
		spentOfflined: report.displayspentOffline ? report.displayspentOffline : 0,
		spentOfflinev: report.videospentOffline ? report.videospentOffline : 0,
		state1: report.req_id
	};
	const LanguageProps = {
		state1: report.req_id,
		arrowRetuner: arrowRetuner,
		url: 'citylanguagebycampids'
	};
	return (
		<div>
			<div className="titleReport">{report.title && report.title.toUpperCase()} Campaign</div>
			<div className="titleReport">Summary Report</div>
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
							<TableCell>{report.report.summaryCompleteReport.fq}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.sq}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.tq}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.complete}</TableCell>
							<TableCell>{report.report.summaryCompleteReport.impressions}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>Publisher Wise</div>
				{report.report.audio.length ? (
					<QuartilePublisher
						title="Audio"
						report={report.report.audio && report.report.audio}
						arrowRetuner={arrowRetuner}
						ids={report.ids}
						state1={report.req_id}
					/>
				) : (
					''
				)}
				{report.report.video.length ? (
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
			<div className="titleReport">Language Wise Summary Report</div>
			<div>
				last updated at - {report.report ? updatedatetimeseter(report.report.allrecentupdate) : 'Not found'}
			</div>
			{report.ids && report.ids.audio && report.ids.audio.length ? (
				<LanguagePro {...LanguageProps} adtype="Audio" ids={report.ids && report.ids.audio} />
			) : (
				''
			)}
			{report.ids && report.ids.display && report.ids.display.length ? (
				<LanguagePro {...LanguageProps} adtype="Display" ids={report.ids && report.ids.display} />
			) : (
				''
			)}
			{report.ids && report.ids.video && report.ids.video.length ? (
				<LanguagePro {...LanguageProps} adtype="Video" ids={report.ids && report.ids.video} />
			) : (
				''
			)}
			<div className="titleReport">Phone Make Model Wise Summary Report</div>
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
			<div className="titleReport">Category Wise Summary Report</div>
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