import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { IdContext } from '../App';
import IconBreadcrumbs from './breadBreed';
import Auditable from './auditable.js';
import PincodeAdmin from './pincodeAdmin.js';
import PhoneModelAdmin from './PhoneModelAdmin';
import IbaReportAdmin from './ibaReportAdmin';
import FrequencyAdmin from './frequencyAdmin';
import PublisherAdmin from './PublisherAdmin';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import CreativeReport from './creative_report';
import Episode_Report from './podcastepisode';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

export default function BasicTable({ singlead }) {
	const history = useHistory();
	const { state1 } = useContext(IdContext);
	const stateru = useSelector((state) => state.ratio.ratio);
	const [ usinr, setusinr ] = useState(74.94715);
	const [ summaryReport, setsummaryReport ] = useState({});
	const [ audioReport, setaudioReport ] = useState({});
	const [ displayReport, setdisplayReport ] = useState({});
	const [ videoReport, setvideoReport ] = useState({});
	const [ lastUpdated, setlastUpdated ] = useState('');
	const [ audiologs, setaudiologs ] = useState([]);
	const [ displaylogs, setdisplaylogs ] = useState([]);
	const [ videologs, setvideologs ] = useState([]);
	const [ pincodereports, setpincodereports ] = useState([]);
	const [ phoneModelReports, setphoneModelReports ] = useState([]);
	const [ ibaReports, setibaReports ] = useState([]);
	const [ frequencyReport, setfrequencyReport ] = useState([]);
	const [ creativereports, setcreative ] = useState([]);
	const [podcastreports,setpodcastreports]=useState([]);
	// const [logs, setlogs] = useState([])
	const [ spentdata, setspentdata ] = useState([]);
	const [ ids, setids ] = useState({});
	const [ impre, setimpre ] = useState(0);
	const [ fq, setfq ] = useState(0);
	const [ sq, setsq ] = useState(0);
	const [ tq, settq ] = useState(0);
	const [ complete, setcomplete ] = useState(0);
	const [ spentOffline, setspentOffline ] = useState(0);
	const [ spentOfflined, setspentOfflined ] = useState(0);
	const [ spentOfflinev, setspentOfflinev ] = useState(0);
	// const [fqd, setfqd] = useState(0)
	// const [sqd, setsqd] = useState(0)
	// const [tqd, settqd] = useState(0)
	// const [completed, setcompleted] = useState(0)
	// const [click, setclick] = useState(0)
	// const [uniquesumcamp, setuniquesumcamp] = useState(0)
	// const [uniquesumcampd, setuniquesumcampd] = useState(0)
	// const [uniquesumcampv, setuniquesumcampv] = useState(0)
	// const [logsd, setlogsd] = useState([])
	// const [logsv, setlogsv] = useState([])
	// const [idsd, setidsd] = useState([])
	// const [impred, setimpred] = useState(0)
	// const [clickd, setclickd] = useState(0)
	// const [imprev, setimprev] = useState(0)
	// const [clickv, setclickv] = useState(0)
	const classes = useStyles();
	// ids setter
	useEffect(
		() => {
			// console.log(singlead.ids)
			setids(singlead.ids);
			if (singlead && singlead.ids && singlead.id) {
				logsPuller(singlead.ids);
				spentPuller(singlead.id);
				pincodeDataPuller(singlead.ids);
				PhoneModelDataPuller(singlead.ids);
				IbaDataPuller(singlead.ids);
				FrequencyPuller(singlead.ids);
				Creativedata(singlead.id);
				PodcastData(singlead.ids)
			}
		},
		[ singlead ]
	);
	useEffect(
		() => {
			// console.log(spentOffline)
			// console.log(stateru);
			if (stateru) {
				setusinr(stateru);
			}
		},
		[ stateru ]
	);
	// spent reciver of all data
	const spentPuller = (idsa) => {
		if (idsa) {
			fetch('/subrepo/spentallrepobyid2', {
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
					setspentdata(result);
				})
				.catch((err) => console.log(err));
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
					// console.log(result[0])
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
	const Creativedata = (idsa) => {
		console.log(idsa);
		if (idsa) {
			fetch('/subrepo/creativewisereports',{
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

	const PodcastData=(idsa)=>{
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
	}

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
	// logs puller
	const logsPuller = (idData) => {
		// console.log(idData)
		fetch('/offreport/sumreportofcamall2', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				campaignId: idData
			})
		})
			.then((res) => res.json())
			.then((resulta) => {
				var result = resulta;
				console.log(result);
				setlastUpdated(result.allrecentupdate);
				setsummaryReport(result.summaryCompleteReport);
				setaudioReport(result.audioCompleteReport);
				setdisplayReport(result.displayCompleteReport);
				setvideoReport(result.videoCompleteReport);
				setimpre(result.audioCompleteReport.impressions);
				// setclick(result.audioCompleteReport.clicks)
				setcomplete(result.audioCompleteReport.complete);
				setfq(result.audioCompleteReport.firstQuartile);
				setsq(result.audioCompleteReport.midpoint);
				settq(result.audioCompleteReport.thirdQuartile);
				var audiospentOffline = 0;
				var displayspentOffline = 0;
				var videospentOffline = 0;
				// result.audio = result.audio && result.audio.filter((x) => x.impressions > 0);
				// result.display = result.display && result.display.filter((x) => x.impressions > 0);
				// result.video = result.video && result.video.filter((x) => x.impressions > 0);
				result.audio &&
					result.audio.map((re) => {
						if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
							// Humgama
							if (re.apppubidpo[0].publishername === 'Hungama') {
								audiospentOffline += parseInt(re.impressions) * 4.25 / 100;
							}
							// Wynk
							if (re.apppubidpo[0].publishername === 'Wynk') {
								audiospentOffline += parseInt(re.impressions) * 10 / 100;
							}
						}
					});
				result.display &&
					result.display.map((re) => {
						if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
							// Humgama
							if (re.apppubidpo[0].publishername === 'Hungama') {
								displayspentOffline += parseInt(re.impressions) * 4.25 / 100;
							}
							// Wynk
							if (re.apppubidpo[0].publishername === 'Wynk') {
								displayspentOffline += parseInt(re.impressions) * 10 / 100;
							}
						}
					});
				result.video &&
					result.video.map((re) => {
						if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
							// Humgama
							if (re.apppubidpo[0].publishername === 'Hungama') {
								videospentOffline += parseInt(re.impressions) * 4.25 / 100;
							}
							// Wynk
							if (re.apppubidpo[0].publishername === 'Wynk') {
								videospentOffline += parseInt(re.impressions) * 10 / 100;
							}
						}
					});
					console.log('checking',result.audio.length)
				setaudiologs(result.audio);
				setdisplaylogs(result.display);
				setvideologs(result.video);
				setspentOffline(audiospentOffline / usinr);
				setspentOfflined(displayspentOffline / usinr);
				setspentOfflinev(videospentOffline / usinr);
			})
			.catch((err) => console.log(err));
	};
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
	const dateformatchanger = (date) => {
		var dategot = date.toString();
		var datechanged = dategot.slice(8, 10) + '-' + dategot.slice(5, 7) + '-' + dategot.slice(0, 4);
		return datechanged;
	};
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
	const updatedatetimeseter = (date) => {
		// console.log(date)
		// var datee = new Date(date);
		var s = new Date(date).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
		// var datee = datee.toString();
		// console.log(s,date,s.split('/'))
		s = s.split('/');
		return s[1] + '/' + s[0] + '/' + s[2];
	};
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
	const completespentfider = (camstype) => {
		if (camstype === 'audio' && spentdata) {
			var allspentdatareq = spentdata.filter((x) => ids.audio.includes(x.campaignId));
			var spent = 0;
			allspentdatareq.map((dat) => {
				spent += parseFloat(dat.totalSpent);
			});
			return spent;
		}
		if (camstype === 'display' && spentdata) {
			var allspentdatareq = spentdata.filter((x) => ids.display.includes(x.campaignId));
			var spent = 0;
			allspentdatareq.map((dat) => {
				spent += parseFloat(dat.totalSpent);
			});
			return spent;
		}
		if (camstype === 'video' && spentdata) {
			var allspentdatareq = spentdata.filter((x) => ids.video.includes(x.campaignId));
			var spent = 0;
			allspentdatareq.map((dat) => {
				spent += parseFloat(dat.totalSpent);
			});
			return spent;
		}
		if (camstype === 'all' && spentdata) {
			var allspentdatareq = spentdata;
			var spent = 0;
			allspentdatareq.map((dat) => {
				spent += parseFloat(dat.totalSpent);
			});
			return spent;
		}
		return 0;
	};
	const SummaryTable = (title, report, target, spent) => {
		// console.log(idsa)
		return (
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
				{singlead._id && report && ids && (report.impressions > 0 || report.clicks > 0) ? (
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
										timefinder(singlead.endDate[0], singlead.startDate[0]),
										timefinder(Date.now(), singlead.startDate[0]),
										target,
										report.impressions
									)
								}}
							>
								{title === 'Summary' && (
									<TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
								)}
								{title === 'Summary' && <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>}
								{title === 'Summary' && (
									<TableCell>{timefinder(singlead.endDate[0], singlead.startDate[0])} days</TableCell>
								)}
								<TableCell>{target}</TableCell>
								<TableCell>{report.impressions}</TableCell>
								<TableCell>
									{Math.round(target / timefinder(singlead.endDate[0], singlead.startDate[0]) * 10) /
										10}
								</TableCell>
								<TableCell>
									{Math.round(
										report.impressions / timefinder(Date.now(), singlead.startDate[0]) * 10
									) / 10}
								</TableCell>
								<TableCell>{Math.round(spent * 1) / 1}</TableCell>
								<TableCell>{report.clicks}</TableCell>
								<TableCell>
									{Math.round(report.clicks * 100 / report.impressions * 100) / 100}%
								</TableCell>
								<TableCell>{target - report.impressions}</TableCell>
								{title === 'Summary' && (
									<TableCell>{timefinder(singlead.endDate[0], Date.now())} days</TableCell>
								)}
								<TableCell
									className="mangeads__report"
									onClick={() => history.push(`/manageAds/${state1}/detailed`)}
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
	const PublisherTable = (title, report) => {
		return (
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
				{singlead._id && report.length && ids ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Publisher</TableCell>
								<TableCell>SSP</TableCell>
								<TableCell>Total Impressions to be delivered</TableCell>
								<TableCell>Total Impressions Delivered till date</TableCell>
								<TableCell>Avg required</TableCell>
								<TableCell>Avg Achieved</TableCell>
								<TableCell>Total spent</TableCell>
								<TableCell>Total Clicks Delivered till date</TableCell>
								<TableCell>CTR</TableCell>
								<TableCell>Balance Impressions</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{report.map((log, i) => {
								return (
									<TableRow
										key={i}
										style={{
											background: colorfinder(
												timefinder(singlead.endDate[0], singlead.startDate[0]),
												timefinder(Date.now(), singlead.startDate[0]),
												parseInt(log.campaignId.TargetImpressions),
												log.impressions
											)
										}}
									>
										<TableCell>
											{log.apppubidpo ? log.apppubidpo.length ? log.apppubidpo[0]
												.publishername ? (
												log.apppubidpo[0].publishername
											) : (
												log.Publisher.AppName
											) : (
												log.Publisher.AppName
											) : (
												log.Publisher.AppName
											)}
										</TableCell>
										<TableCell>
											{log.apppubidpo && log.apppubidpo[0] && log.apppubidpo[0].ssp}
										</TableCell>
										<TableCell>{parseInt(log.campaignId.TargetImpressions)}</TableCell>
										<TableCell>{log.impressions}</TableCell>
										<TableCell>
											{Math.round(
												parseInt(log.campaignId.TargetImpressions) /
													timefinder(singlead.endDate[0], singlead.startDate[0]) *
													10
											) / 10}
										</TableCell>
										<TableCell>
											{Math.round(
												log.impressions / timefinder(Date.now(), singlead.startDate[0]) * 10
											) / 10}
										</TableCell>
										<TableCell>
											{Math.round(
												(spentfinder(log.Publisher._id, log.campaignId._id, log.impressions) +
													parseInt(title === 'audio' ? spentOffline : 0) +
													parseInt(title === 'display' ? spentOfflined : 0) +
													parseInt(title === 'video' ? spentOfflinev : 0)) *
													1
											) / 1}
										</TableCell>
										<TableCell>{log.clicks}</TableCell>
										<TableCell>
											{Math.round(log.clicks * 100 / log.impressions * 100) / 100}%
										</TableCell>
										<TableCell>
											{parseInt(log.campaignId.TargetImpressions) - log.impressions}
										</TableCell>
										<TableCell
											className="mangeads__report"
											onClick={() => history.push(`/manageAds/${state1}/detailed`)}
										>
											Detailed Report
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<div style={{ margin: '10px', fontSize: '20px' }}>Loading or No Data Found</div>
				)}
			</TableContainer>
		);
	};
	const tablesorter = (title, order, type, coloumn, doublecoloumn, isZero, setsa, setsorted, streamingads) => {
		var datareq = streamingads;
		// console.log(order,datareq)
		if (order === 1) {
			datareq = datareq.sort(function(a, b) {
				if (type === 'date') {
					if (isZero) {
						var d1 = new Date(a[coloumn][0]);
						var d2 = new Date(b[coloumn][0]);
					} else {
						var d1 = new Date(a[coloumn]);
						var d2 = new Date(b[coloumn]);
					}
					return d2 - d1;
				} else if (type === 'num') {
					if (isZero) {
						if (doublecoloumn) {
							var d1 = a[coloumn] ? parseInt(a[coloumn][doublecoloumn][0]) : 0;
							var d2 = b[coloumn] ? parseInt(b[coloumn][doublecoloumn][0]) : 0;
						} else {
							var d1 = parseInt(a[coloumn][0]);
							var d2 = parseInt(b[coloumn][0]);
						}
					} else {
						if (doublecoloumn) {
							var d1 = a[coloumn] ? parseInt(a[coloumn][doublecoloumn]) : 0;
							var d2 = b[coloumn] ? parseInt(b[coloumn][doublecoloumn]) : 0;
						} else {
							var d1 = parseInt(a[coloumn]);
							var d2 = parseInt(b[coloumn]);
							// console.log(d1,d2)
						}
					}
					return d2 - d1;
				} else {
					if (isZero) {
						if (doublecoloumn) {
							var aa =
								a[coloumn] && a[coloumn][0] && a[coloumn][0][doublecoloumn]
									? a[coloumn][0][doublecoloumn]
									: null;
							var ba =
								b[coloumn] && b[coloumn][0] && b[coloumn][0][doublecoloumn]
									? b[coloumn][0][doublecoloumn]
									: null;
							if (aa < ba) {
								return -1;
							}
							if (aa > ba) {
								return 1;
							}
							return 0;
						} else {
							var aa = a[coloumn][0] ? a[coloumn][0] : null;
							var ba = b[coloumn][0] ? b[coloumn][0] : null;
							if (aa < ba) {
								return -1;
							}
							if (aa > ba) {
								return 1;
							}
							return 0;
						}
					} else {
						if (doublecoloumn) {
							var aa = a[coloumn] && a[coloumn][doublecoloumn] ? a[coloumn][doublecoloumn] : null;
							var ba = b[coloumn] && b[coloumn][doublecoloumn] ? b[coloumn][doublecoloumn] : null;
							if (aa < ba) {
								return -1;
							}
							if (aa > ba) {
								return 1;
							}
							return 0;
						} else {
							var aa = a[coloumn] ? a[coloumn] : null;
							var ba = b[coloumn] ? b[coloumn] : null;
							if (aa < ba) {
								return -1;
							}
							if (aa > ba) {
								return 1;
							}
							return 0;
						}
					}
				}
			});
		} else {
			datareq = datareq.sort(function(a, b) {
				if (type === 'date') {
					if (isZero) {
						var d1 = new Date(a[coloumn][0]);
						var d2 = new Date(b[coloumn][0]);
					} else {
						var d1 = new Date(a[coloumn]);
						var d2 = new Date(b[coloumn]);
					}
					return d1 - d2;
				} else if (type === 'num') {
					if (isZero) {
						if (doublecoloumn) {
							var d1 = a[coloumn] ? parseInt(a[coloumn][doublecoloumn][0]) : 0;
							var d2 = b[coloumn] ? parseInt(b[coloumn][doublecoloumn][0]) : 0;
						} else {
							var d1 = parseInt(a[coloumn][0]);
							var d2 = parseInt(b[coloumn][0]);
						}
					} else {
						if (doublecoloumn) {
							var d1 = a[coloumn] ? parseInt(a[coloumn][doublecoloumn]) : 0;
							var d2 = b[coloumn] ? parseInt(b[coloumn][doublecoloumn]) : 0;
						} else {
							var d1 = parseInt(a[coloumn]);
							var d2 = parseInt(b[coloumn]);
							// console.log(d1,d2)
						}
					}
					return d1 - d2;
				} else {
					if (isZero) {
						if (doublecoloumn) {
							var aa =
								a[coloumn] && a[coloumn][0] && a[coloumn][0][doublecoloumn]
									? a[coloumn][0][doublecoloumn]
									: null;
							var ba =
								b[coloumn] && b[coloumn][0] && b[coloumn][0][doublecoloumn]
									? b[coloumn][0][doublecoloumn]
									: null;
							if (aa < ba) {
								return 1;
							}
							if (aa > ba) {
								return -1;
							}
							return 0;
						} else {
							var aa = a[coloumn][0] ? a[coloumn][0] : null;
							var ba = b[coloumn][0] ? b[coloumn][0] : null;
							if (aa < ba) {
								return 1;
							}
							if (aa > ba) {
								return -1;
							}
							return 0;
						}
					} else {
						if (doublecoloumn) {
							var aa = a[coloumn] && a[coloumn][doublecoloumn] ? a[coloumn][doublecoloumn] : null;
							var ba = b[coloumn] && b[coloumn][doublecoloumn] ? b[coloumn][doublecoloumn] : null;
							if (aa < ba) {
								return 1;
							}
							if (aa > ba) {
								return -1;
							}
							return 0;
						} else {
							var aa = a[coloumn] ? a[coloumn] : null;
							var ba = b[coloumn] ? b[coloumn] : null;
							if (aa < ba) {
								return 1;
							}
							if (aa > ba) {
								return -1;
							}
							return 0;
						}
					}
				}
			});
		}
		// console.log(datareq)
		setsa(title);
		setsorted(datareq);
	};
	const arrowRetuner = (mode) => {
		if (mode === '1') {
			return <ArrowUpwardRoundedIcon fontSize="small" />;
		} else if (mode === '2') {
			return <ArrowDownwardRoundedIcon fontSize="small" />;
		} else {
			return <ArrowUpwardRoundedIcon fontSize="small" style={{ color: 'lightgrey' }} />;
		}
	};
	return (
		<React.Fragment>
			<IconBreadcrumbs />
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				{state1 && state1.toUpperCase()} Campaign
			</div>
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{SummaryTable(
				'Summary',
				summaryReport,
				ids && ids.audimpression + ids.disimpression + ids.vidimpression,
				completespentfider('all') + spentOffline + spentOfflined + spentOfflinev
			)}
			{ids && ids.audio && ids.audio.length ? (
				audioReport &&
				SummaryTable('Audio', audioReport, ids && ids.audimpression, completespentfider('audio') + spentOffline)
			) : (
				''
			)}
			{ids && ids.display && ids.display.length ? (
				displayReport &&
				SummaryTable(
					'Display',
					displayReport,
					ids && ids.disimpression,
					completespentfider('display') + spentOfflined
				)
			) : (
				''
			)}
			{ids && ids.video && ids.video.length ? (
				videoReport &&
				SummaryTable(
					'Video',
					videoReport,
					ids && ids.vidimpression,
					completespentfider('video') + spentOfflinev
				)
			) : (
				''
			)}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Publisher Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{/* {PublisherTable('Audio',audiologs)}
        {PublisherTable('Display',displaylogs)}
        {PublisherTable('video',videologs)} */}
			{audiologs.length ? (
				<PublisherAdmin
					singlead={singlead}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					colorfinder={colorfinder}
					timefinder={timefinder}
					ids={ids}
					spentfinder={spentfinder}
					spentOffline={spentOffline}
					spentOfflined={spentOfflined}
					spentOfflinev={spentOfflinev}
					title="Audio"
					state1={state1}
					report={audiologs && audiologs}
				/>
			) : (
				''
			)}
			{displaylogs.length ? (
				<PublisherAdmin
					singlead={singlead}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					colorfinder={colorfinder}
					timefinder={timefinder}
					ids={ids}
					spentfinder={spentfinder}
					spentOffline={spentOffline}
					spentOfflined={spentOfflined}
					spentOfflinev={spentOfflinev}
					title="Display"
					state1={state1}
					report={displaylogs && displaylogs}
				/>
			) : (
				''
			)}
			{videologs.length ? (
				<PublisherAdmin
					singlead={singlead}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					colorfinder={colorfinder}
					timefinder={timefinder}
					ids={ids}
					spentfinder={spentfinder}
					spentOffline={spentOffline}
					spentOfflined={spentOfflined}
					spentOfflinev={spentOfflinev}
					title="Video"
					state1={state1}
					report={videologs && videologs}
				/>
			) : (
				''
			)}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Quartile Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
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
							<TableCell>{fq}</TableCell>
							<TableCell>{sq > 0 && sq}</TableCell>
							<TableCell>{tq}</TableCell>
							<TableCell>{complete > 0 && complete}</TableCell>
							<TableCell>{impre}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>Publisher Wise</div>
				{ids && ids.audio && ids.audio.length ? (
					<React.Fragment>
						<div style={{ margin: '5px', fontWeight: 'bolder' }}>Audio Type</div>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Publisher</TableCell>
									<TableCell>First Quartile</TableCell>
									<TableCell>Second Quartile</TableCell>
									<TableCell>Third Quartile</TableCell>
									<TableCell>Complete</TableCell>
									<TableCell>Total Impresions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{audiologs ? (
									audiologs.map((log, i) => {
										if (!log.nameads) {
											return (
												<TableRow key={i}>
													{log.apppubidpo ? log.apppubidpo.length ? log.apppubidpo[0]
														.publishername ? (
														log.apppubidpo[0].publishername
													) : (
														log.Publisher.AppName
													) : (
														log.Publisher.AppName
													) : (
														log.Publisher.AppName
													)}
													<TableCell>{log.firstQuartile}</TableCell>
													<TableCell>{log.midpoint}</TableCell>
													<TableCell>{log.thirdQuartile}</TableCell>
													<TableCell>{log.complete}</TableCell>
													<TableCell>{log.impressions}</TableCell>
												</TableRow>
											);
										}
									})
								) : (
									<TableRow>
										<TableCell>Loading or no data found</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</React.Fragment>
				) : (
					''
				)}
				{ids && ids.video && ids.video.length ? (
					<React.Fragment>
						<div style={{ margin: '5px', fontWeight: 'bolder' }}>Video Type</div>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Publisher</TableCell>
									<TableCell>First Quartile</TableCell>
									<TableCell>Second Quartile</TableCell>
									<TableCell>Third Quartile</TableCell>
									<TableCell>Complete</TableCell>
									<TableCell>Total Impresions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{videologs ? (
									videologs.map((log, i) => {
										if (!log.nameads) {
											return (
												<TableRow key={i}>
													{log.apppubidpo ? log.apppubidpo.length ? log.apppubidpo[0]
														.publishername ? (
														log.apppubidpo[0].publishername
													) : (
														log.Publisher.AppName
													) : (
														log.Publisher.AppName
													) : (
														log.Publisher.AppName
													)}
													<TableCell>{log.firstQuartile}</TableCell>
													<TableCell>{log.midpoint}</TableCell>
													<TableCell>{log.thirdQuartile}</TableCell>
													<TableCell>{log.complete}</TableCell>
													<TableCell>{log.impressions}</TableCell>
												</TableRow>
											);
										}
									})
								) : (
									<TableRow>
										<TableCell>Loading or no data found</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</React.Fragment>
				) : (
					''
				)}
			</TableContainer>
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Language Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{ids && ids.audio && ids.audio.length ? (
				<Auditable
					adtype="Audio"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					streamingads={singlead}
					title="Language"
					regtitle="language"
					jsotitle="citylanguage"
					ids={ids && ids.audio}
					url="citylanguagebycampids"
				/>
			) : (
				''
			)}
			{ids && ids.display && ids.display.length ? (
				<Auditable
					adtype="Display"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					streamingads={singlead}
					title="Language"
					regtitle="language"
					jsotitle="citylanguage"
					ids={ids && ids.display}
					url="citylanguagebycampids"
				/>
			) : (
				''
			)}
			{ids && ids.video && ids.video.length ? (
				<Auditable
					adtype="Video"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					streamingads={singlead}
					title="Language"
					regtitle="language"
					jsotitle="citylanguage"
					ids={ids && ids.video}
					url="citylanguagebycampids"
				/>
			) : (
				''
			)}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Phone Make Model Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{ids && ids.audio && ids.audio.length ? (
				phoneModelReports &&
				phoneModelReports.audio && (
					<PhoneModelAdmin
						title="Audio"
						state1={state1}
						tablesorter={tablesorter}
						arrowRetuner={arrowRetuner}
						report={phoneModelReports && phoneModelReports.audio}
					/>
				)
			) : (
				''
			)}
			{ids && ids.display && ids.display.length ? (
				phoneModelReports &&
				phoneModelReports.display && (
					<PhoneModelAdmin
						title="Display"
						state1={state1}
						tablesorter={tablesorter}
						arrowRetuner={arrowRetuner}
						report={phoneModelReports && phoneModelReports.display}
					/>
				)
			) : (
				''
			)}
			{ids && ids.video && ids.video.length ? (
				phoneModelReports &&
				phoneModelReports.video && (
					<PhoneModelAdmin
						title="Video"
						state1={state1}
						tablesorter={tablesorter}
						arrowRetuner={arrowRetuner}
						report={phoneModelReports && phoneModelReports.video}
					/>
				)
			) : (
				''
			)}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Frequency Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{ids && ids.audio && ids.audio.length ? (
				<FrequencyAdmin
					title="Audio"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={frequencyReport && frequencyReport.audio}
				/>
			) : (
				''
			)}
			{ids && ids.display && ids.display.length ? (
				<FrequencyAdmin
					title="Display"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={frequencyReport && frequencyReport.display}
				/>
			) : (
				''
			)}
			{ids && ids.video && ids.video.length ? (
				<FrequencyAdmin
					title="Video"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={frequencyReport && frequencyReport.video}
				/>
			) : (
				''
			)}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Category Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{/* {PincodeTable('audio', pincodereports && pincodereports.audio)} */}
			{ids && ids.audio && ids.audio.length ? (
				<IbaReportAdmin
					title="Audio"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={ibaReports && ibaReports.audio}
				/>
			) : (
				''
			)}
			{ids && ids.display && ids.display.length ? (
				<IbaReportAdmin
					title="Display"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={ibaReports && ibaReports.display}
				/>
			) : (
				''
			)}
			{ids && ids.video && ids.video.length ? (
				<IbaReportAdmin
					title="Video"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={ibaReports && ibaReports.video}
				/>
			) : (
				''
			)}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Pincode Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{/* {PincodeTable('audio', pincodereports && pincodereports.audio)} */}
			{ids && ids.audio && ids.audio.length ? (
				<PincodeAdmin
					title="Audio"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={pincodereports && pincodereports.audio}
				/>
			) : (
				''
			)}
			{ids && ids.display && ids.display.length ? (
				<PincodeAdmin
					title="Display"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={pincodereports && pincodereports.display}
				/>
			) : (
				''
			)}
			{ids && ids.video && ids.video.length ? (
				<PincodeAdmin
					title="Video"
					state1={state1}
					tablesorter={tablesorter}
					arrowRetuner={arrowRetuner}
					report={pincodereports && pincodereports.video}
				/>
			) : (
				''
			)}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Podcast Episode Wise Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{/* {PincodeTable('audio', pincodereports && pincodereports.audio)} */}
			<Episode_Report
				// title="Audio"
				state1={state1}
				tablesorter={tablesorter}
				arrowRetuner={arrowRetuner}
				report={podcastreports}
			/>
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Creative Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{/* {PincodeTable('audio', pincodereports && pincodereports.audio)} */}
			<CreativeReport
				// title="Audio"
				state1={state1}
				tablesorter={tablesorter}
				arrowRetuner={arrowRetuner}
				report={creativereports}
			/>
		</React.Fragment>
	);
}

// unique users finder audio
// useEffect(()=>{
//     if(ids){
//         fetch('/subrepo/uniqueusersbycampids',{
//             method:'put',
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
//             },body:JSON.stringify({
//                 campaignId:ids.audio
//             })
//         }).then(res=>res.json())
//         .then(result=>{
//             console.log(result[0])
//             console.log(ids)
//             setuniquesumcamp(result[0].unique)
//         })
//         .catch(err=>console.log(err))
//     }
// },[ids])
// // unique users finder display
// useEffect(()=>{
//     if(ids){
//         fetch('/subrepo/uniqueusersbycampids',{
//             method:'put',
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
//             },body:JSON.stringify({
//                 campaignId:ids.display
//             })
//         }).then(res=>res.json())
//         .then(result=>{
//             console.log(result[0])
//             setuniquesumcampd(result[0].unique)
//         })
//         .catch(err=>console.log(err))
//     }
// },[ids])
// // unique users finder video
// useEffect(()=>{
//     if(ids){
//         fetch('/subrepo/uniqueusersbycampids',{
//             method:'put',
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
//             },body:JSON.stringify({
//                 campaignId:ids.video
//             })
//         }).then(res=>res.json())
//         .then(result=>{
//             console.log(result[0])
//             setuniquesumcampv(result[0].unique)
//         })
//         .catch(err=>console.log(err))
//     }
// },[ids])
// <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
//         <div style={{margin:'5px',fontWeight:'bolder'}}>Complete Report</div>
//     <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//         <TableRow>
//             <TableCell>Campaign Start Date</TableCell>
//             <TableCell>Campaign End Date</TableCell>
//             <TableCell>Total Days of Campaign</TableCell>
//             <TableCell>Total Impressions to be delivered</TableCell>
//             <TableCell>Total Impressions Delivered till date</TableCell>
//             {/* <TableCell>Unique Users</TableCell> */}
//             <TableCell>Avg required</TableCell>
//             <TableCell>Avg Achieved</TableCell>
//             <TableCell>Total spent</TableCell>
//             <TableCell>Total Clicks Delivered till date</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Balance Impressions</TableCell>
//             <TableCell>Balance Days</TableCell>
//             <TableCell></TableCell>
//         </TableRow>
//         </TableHead>
//         <TableBody>
//         {singlead._id && (logs.length>0 || logsd.length>0 || logsv.length>0) && ids ?
//             <TableRow
//             style={{
//                     background: colorfinder(
//                         timefinder(singlead.endDate[0],singlead.startDate[0]) ,
//                         timefinder(Date.now(),singlead.startDate[0]) ,
//                         ids && (ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 ),
//                         impre + impred + imprev
//                     )
//                 }}
//                 >
//                 <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
//                 <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
//                 <TableCell>{ids && (ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 ) }</TableCell>
//                 <TableCell>{impre + impred + imprev}</TableCell>
//                 {/* <TableCell>{uniquesumcamp + uniquesumcampd + uniquesumcampv}</TableCell> */}
//                 <TableCell>{ids &&  Math.round(((ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 ))/timefinder(singlead.endDate[0],singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round((impre + impred + imprev)/timefinder(Date.now(),singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round((completespentfider('all') + spentOffline + spentOfflined + spentOfflinev )*1)/1}</TableCell>
//                 <TableCell>{click + clickd + clickv}</TableCell>
//                 <TableCell>{Math.round((click + clickd + clickv)*100/(impre + impred + imprev) *100)/100}%</TableCell>
//                 <TableCell>{ids && (ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 )- impre - impred - imprev}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],Date.now())} days</TableCell>
//                 <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
//             </TableRow>
//         : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
//         </TableBody>
//     </Table>
//     </TableContainer>
//     <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
//         <div style={{margin:'5px',fontWeight:'bolder'}}>Audio Type</div>
//     <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//         <TableRow>
//             <TableCell>Campaign Start Date</TableCell>
//             <TableCell>Campaign End Date</TableCell>
//             <TableCell>Total Days of Campaign</TableCell>
//             <TableCell>Total Impressions to be delivered</TableCell>
//             <TableCell>Total Impressions Delivered till date</TableCell>
//             {/* <TableCell>Unique Users</TableCell> */}
//             <TableCell>Avg required</TableCell>
//             <TableCell>Avg Achieved</TableCell>
//             <TableCell>Total spent</TableCell>
//             <TableCell>Total Clicks Delivered till date</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Balance Impressions</TableCell>
//             <TableCell>Balance Days</TableCell>
//             <TableCell></TableCell>
//         </TableRow>
//         </TableHead>
//         <TableBody>
//         {singlead._id && (logs.length>0) && ids ?
//             <TableRow
//                 style={{
//                     background: colorfinder(
//                         timefinder(singlead.endDate[0],singlead.startDate[0]) ,
//                         timefinder(Date.now(),singlead.startDate[0]) ,
//                         ids && ids.audimpression,
//                         impre
//                     )
//                 }}
//             >
//                 <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
//                 <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
//                 <TableCell>{ids && ids.audimpression}</TableCell>
//                 <TableCell>{impre}</TableCell>
//                 {/* <TableCell>{uniquesumcamp}</TableCell> */}
//                 <TableCell>{ids &&  Math.round(ids.audimpression/timefinder(singlead.endDate[0],singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round(impre/timefinder(Date.now(),singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round((completespentfider('audio') + spentOffline)*1)/1}</TableCell>
//                 <TableCell>{click}</TableCell>
//                 <TableCell>{Math.round(click*100/impre *100)/100}%</TableCell>
//                 <TableCell>{ids && ids.audimpression-impre}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],Date.now())} days</TableCell>
//                 <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
//             </TableRow>
//         : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
//         </TableBody>
//     </Table>
//     </TableContainer>
//     <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
//     <div style={{margin:'5px',fontWeight:'bolder'}}>Display Type</div>
//     <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//         <TableRow>
//             <TableCell>Campaign Start Date</TableCell>
//             <TableCell>Campaign End Date</TableCell>
//             <TableCell>Total Days of Campaign</TableCell>
//             <TableCell>Total Impressions to be delivered</TableCell>
//             <TableCell>Total Impressions Delivered till date</TableCell>
//             {/* <TableCell>Unique Users</TableCell> */}
//             <TableCell>Avg required</TableCell>
//             <TableCell>Avg Achieved</TableCell>
//             <TableCell>Total spent</TableCell>
//             <TableCell>Total Clicks Delivered till date</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Balance Impressions</TableCell>
//             <TableCell>Balance Days</TableCell>
//             <TableCell></TableCell>
//         </TableRow>
//         </TableHead>
//         <TableBody>
//         {singlead._id && ids && (logsd.length>0) ?
//             <TableRow
//                 style={{
//                     background: colorfinder(
//                         timefinder(singlead.endDate[0],singlead.startDate[0]) ,
//                         timefinder(Date.now(),singlead.startDate[0]) ,
//                         ids && ids.disimpression,
//                         impred
//                         )
//                 }}
//             >
//                 <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
//                 <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
//                 <TableCell>{ids && ids.disimpression}</TableCell>
//                 <TableCell>{impred}</TableCell>
//                 {/* <TableCell>{uniquesumcampd}</TableCell> */}
//                 <TableCell>{ids && Math.round(ids.disimpression/timefinder(singlead.endDate[0],singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round(impred/timefinder(Date.now(),singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round((completespentfider('display') + spentOfflined)*1)/1}</TableCell>
//                 <TableCell>{clickd}</TableCell>
//                 <TableCell>{Math.round(clickd*100/impred *100)/100}%</TableCell>
//                 <TableCell>{ids && ids.disimpression-impred}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],Date.now())} days</TableCell>
//                 <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
//             </TableRow>
//         : <div>Loading or no data found</div>}
//         </TableBody>
//     </Table>
//     </TableContainer>
//     <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
//     <div style={{margin:'5px',fontWeight:'bolder'}}>Video Type</div>
//     <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//         <TableRow>
//             <TableCell>Campaign Start Date</TableCell>
//             <TableCell>Campaign End Date</TableCell>
//             <TableCell>Total Days of Campaign</TableCell>
//             <TableCell>Total Impressions to be delivered</TableCell>
//             <TableCell>Total Impressions Delivered till date</TableCell>
//             {/* <TableCell>Unique Users</TableCell> */}
//             <TableCell>Avg required</TableCell>
//             <TableCell>Avg Achieved</TableCell>
//             <TableCell>Total spent</TableCell>
//             <TableCell>Total Clicks Delivered till date</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Balance Impressions</TableCell>
//             <TableCell>Balance Days</TableCell>
//             <TableCell></TableCell>
//         </TableRow>
//         </TableHead>
//         <TableBody>
//         {singlead._id && ids && (logsv.length>0) ?
//             <TableRow
//                 style={{
//                     background: colorfinder(
//                         timefinder(singlead.endDate[0],singlead.startDate[0]) ,
//                         timefinder(Date.now(),singlead.startDate[0]) ,
//                         ids && ids.vidimpression,
//                         imprev
//                     )
//                 }}
//             >
//                 <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
//                 <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
//                 <TableCell>{ids && ids.vidimpression}</TableCell>
//                 <TableCell>{imprev}</TableCell>
//                 {/* <TableCell>{uniquesumcampv}</TableCell> */}
//                 <TableCell>{ids && Math.round(ids.vidimpression/timefinder(singlead.endDate[0],singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round(imprev/timefinder(Date.now(),singlead.startDate[0])*10)/10}</TableCell>
//                 <TableCell>{Math.round((completespentfider('video') + spentOfflinev)*1)/1}</TableCell>
//                 <TableCell>{clickv}</TableCell>
//                 <TableCell>{Math.round(clickv*100/imprev *100)/100}%</TableCell>
//                 <TableCell>{ids && ids.vidimpression-imprev}</TableCell>
//                 <TableCell>{timefinder(singlead.endDate[0],Date.now())} days</TableCell>
//                 <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
//             </TableRow>
//         : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
//         </TableBody>
//     </Table>
//     </TableContainer>
// <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
//         <div style={{margin:'5px',fontWeight:'bolder'}}>Audio Type</div>
//     <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//         <TableRow>
//             <TableCell>Publisher</TableCell>
//             <TableCell>Campaign Start Date</TableCell>
//             <TableCell>Campaign End Date</TableCell>
//             <TableCell>Total Days of Campaign</TableCell>
//             <TableCell>Total Impressions to be delivered</TableCell>
//             <TableCell>Total Impressions Delivered till date</TableCell>
//             {/* <TableCell>Unique Users</TableCell> */}
//             <TableCell>Avg required</TableCell>
//             <TableCell>Avg Achieved</TableCell>
//             <TableCell>Total spent</TableCell>
//             <TableCell>Total Clicks Delivered till date</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Balance Impressions</TableCell>
//             <TableCell>Balance Days</TableCell>
//             <TableCell></TableCell>
//         </TableRow>
//         </TableHead>
//         <TableBody>
//         {singlead._id ? logs.length &&
//             logs.map((log,i) => {
//                 return <TableRow key={i}
//                     style={{
//                         background: colorfinder(
//                             timefinder(log.campaignId.endDate,log.campaignId.startDate),
//                             timefinder(Date.now(),log.campaignId.startDate),
//                             log.campaignId.TargetImpressions && log.campaignId.TargetImpressions,
//                             log.impressions
//                             )
//                     }}
//                 >
//                     <TableCell>{log.Publisher && log.Publisher.AppName} {log.nameads && log.nameads}</TableCell>
//                     <TableCell>{dateformatchanger(log.campaignId.startDate.slice(0,10))}</TableCell>
//                     <TableCell>{dateformatchanger(log.campaignId.endDate.slice(0,10))}</TableCell>
//                     <TableCell>{timefinder(log.campaignId.endDate,log.campaignId.startDate)} days</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions && log.campaignId.TargetImpressions}</TableCell>
//                     <TableCell>{log.impressions}</TableCell>
//                     {/* <TableCell>{log.publishunique && uniquetopfinder(log.publishunique)}</TableCell> */}
//                     <TableCell>{log.campaignId.TargetImpressions && Math.round(log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate,log.campaignId.startDate) *10)/10}</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions && Math.round(log.impressions/timefinder(Date.now(),log.campaignId.startDate) *10)/10}</TableCell>
//                     <TableCell>{log.Publisher && Math.round(spentfinder(log.Publisher._id,log.campaignId._id,log.impressions)*1)/1}</TableCell>
//                     <TableCell>{log.clicks}</TableCell>
//                     <TableCell>{Math.round(log.clicks*100/log.impressions *100)/100}%</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions&& log.campaignId.TargetImpressions-log.impressions}</TableCell>
//                     <TableCell>{timefinder(log.campaignId.endDate,Date.now())} days</TableCell>
//                     <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
//                 </TableRow>
//             })
//         : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
//         </TableBody>
//     </Table>
//     </TableContainer>
//     <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
//         <div style={{margin:'5px',fontWeight:'bolder'}}>Display Type</div>
//     <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//         <TableRow>
//             <TableCell>Publisher</TableCell>
//             <TableCell>Campaign Start Date</TableCell>
//             <TableCell>Campaign End Date</TableCell>
//             <TableCell>Total Days of Campaign</TableCell>
//             <TableCell>Total Impressions to be delivered</TableCell>
//             <TableCell>Total Impressions Delivered till date</TableCell>
//             {/* <TableCell>Unique Users</TableCell> */}
//             <TableCell>Avg required</TableCell>
//             <TableCell>Avg Achieved</TableCell>
//             <TableCell>Total spent</TableCell>
//             <TableCell>Total Clicks Delivered till date</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Balance Impressions</TableCell>
//             <TableCell>Balance Days</TableCell>
//             <TableCell></TableCell>
//         </TableRow>
//         </TableHead>
//         <TableBody>
//         {singlead._id ? logsd.length &&
//             logsd.map((log,i) => {
//                 return <TableRow key={i}
//                     style={{
//                         background: colorfinder(
//                             timefinder(log.campaignId.endDate,log.campaignId.startDate),
//                             timefinder(Date.now(),log.campaignId.startDate),
//                             log.campaignId.TargetImpressions && log.campaignId.TargetImpressions,
//                             log.impressions
//                         )
//                     }}
//                 >
//                     <TableCell>{log.Publisher && log.Publisher.AppName} {log.nameads && log.nameads}</TableCell>
//                     <TableCell>{dateformatchanger(log.campaignId.startDate.slice(0,10))}</TableCell>
//                     <TableCell>{dateformatchanger(log.campaignId.endDate.slice(0,10))}</TableCell>
//                     <TableCell>{timefinder(log.campaignId.endDate,log.campaignId.startDate)} days</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions && log.campaignId.TargetImpressions}</TableCell>
//                     <TableCell>{log.impressions}</TableCell>
//                     {/* <TableCell>{log.publishunique && uniquetopfinder(log.publishunique)}</TableCell> */}
//                     <TableCell>{log.campaignId.TargetImpressions && Math.round(log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate,log.campaignId.startDate) *10)/10}</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions && Math.round(log.impressions/timefinder(Date.now(),log.campaignId.startDate) *10)/10}</TableCell>
//                     <TableCell>{log.Publisher && Math.round((spentfinder(log.Publisher._id,log.campaignId._id,log.impressions,log.impressions))*1)/1}</TableCell>
//                     <TableCell>{log.clicks}</TableCell>
//                     <TableCell>{Math.round(log.clicks*100/log.impressions *100)/100}%</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions&& log.campaignId.TargetImpressions-log.impressions}</TableCell>
//                     <TableCell>{timefinder(log.campaignId.endDate,Date.now())} days</TableCell>
//                     <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
//                 </TableRow>
//             })
//             : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
//         </TableBody>
//     </Table>
//     </TableContainer>
//     <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
//         <div style={{margin:'5px',fontWeight:'bolder'}}>Video Type</div>
//     <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//         <TableRow>
//             <TableCell>Publisher</TableCell>
//             <TableCell>Campaign Start Date</TableCell>
//             <TableCell>Campaign End Date</TableCell>
//             <TableCell>Total Days of Campaign</TableCell>
//             <TableCell>Total Impressions to be delivered</TableCell>
//             <TableCell>Total Impressions Delivered till date</TableCell>
//             {/* <TableCell>Unique Users</TableCell> */}
//             <TableCell>Avg required</TableCell>
//             <TableCell>Avg Achieved</TableCell>
//             <TableCell>Total spent</TableCell>
//             <TableCell>Total Clicks Delivered till date</TableCell>
//             <TableCell>CTR</TableCell>
//             <TableCell>Balance Impressions</TableCell>
//             <TableCell>Balance Days</TableCell>
//             <TableCell></TableCell>
//         </TableRow>
//         </TableHead>
//         <TableBody>
//         {singlead._id ? logsv.length &&
//             logsv.map((log,i) => {
//                 return <TableRow key={i}
//                     style={{
//                         background: colorfinder(
//                             timefinder(log.campaignId.endDate,log.campaignId.startDate),
//                             timefinder(Date.now(),log.campaignId.startDate),
//                             log.campaignId.TargetImpressions && log.campaignId.TargetImpressions,
//                             log.impressions
//                             )
//                     }}
//                 >
//                     <TableCell>{log.Publisher && log.Publisher.AppName} {log.nameads && log.nameads}</TableCell>
//                     <TableCell>{dateformatchanger(log.campaignId.startDate.slice(0,10))}</TableCell>
//                     <TableCell>{dateformatchanger(log.campaignId.endDate.slice(0,10))}</TableCell>
//                     <TableCell>{timefinder(log.campaignId.endDate,log.campaignId.startDate)} days</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions && log.campaignId.TargetImpressions}</TableCell>
//                     <TableCell>{log.impressions}</TableCell>
//                     {/* <TableCell>{log.publishunique && uniquetopfinder(log.publishunique)}</TableCell> */}
//                     <TableCell>{log.campaignId.TargetImpressions && Math.round(log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate,log.campaignId.startDate) *10)/10}</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions && Math.round(log.impressions/timefinder(Date.now(),log.campaignId.startDate) *10)/10}</TableCell>
//                     <TableCell>{log.Publisher && Math.round(spentfinder(log.Publisher._id,log.campaignId._id,log.impressions)*1)/1}</TableCell>
//                     <TableCell>{log.clicks}</TableCell>
//                     <TableCell>{Math.round(log.clicks*100/log.impressions *100)/100}%</TableCell>
//                     <TableCell>{log.campaignId.TargetImpressions&& log.campaignId.TargetImpressions-log.impressions}</TableCell>
//                     <TableCell>{timefinder(log.campaignId.endDate,Date.now())} days</TableCell>
//                     <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
//                 </TableRow>
//             })
//         : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
//         </TableBody>
//     </Table>
//     </TableContainer>
// logs puller for audio campaigns
// useEffect(()=>{
//     if(ids && ids.audio){
//         fetch('/offreport/sumreportofcam22',{
//             method:'put',
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
//             },body:JSON.stringify({
//                 campaignId:ids.audio
//             })
//         }).then(res=>res.json())
//         .then(result=>{
//             var impressions1 = 0;
//             var clicks1 = 0;
//             var firt1 = 0;
//             var sec1 = 0;
//             var thir1 = 0;
//             var compo1 = 0;
//             var spentdodal = 0;
//             var logss = result;
//             console.log(result)
//             result.map((re)=>{
//                 if(re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
//                     re.nameads = 'Offline'
//                     // Humgama
//                     if(re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
//                         spentdodal += parseInt(re.impressions)*4.25/100
//                     }
//                     // Wynk
//                     if(re.Publisher._id.toString() === '5b2210af504f3097e73e0d8b'){
//                         spentdodal += parseInt(re.impressions)*10/100
//                     }
//                 }console.log(re)
//                 impressions1 += re.impressions
//                 clicks1 += re.clicks
//                 firt1 += re.firstQuartile ? re.firstQuartile : 0
//                 sec1 += re.midpoint ? re.midpoint : 0
//                 thir1 += re.thirdQuartile ? re.thirdQuartile : 0
//                 compo1 += re.complete ? re.complete : 0
//             })
//             logss = logss.filter(x => x.impressions!==0)
//             logss = logss.sort(function(a,b){
//                 var d1 = new Date(a.updatedAt[0])
//                 var d2 = new Date(b.updatedAt[0])
//                 return d2 - d1
//             })
//             console.log(logss)
//             if(logss.length)
//             setlogs(logss)
//             if(impressions1)
//             setimpre(impressions1)
//             if(clicks1)
//             setclick(clicks1)
//             if(firt1)
//             setfq(firt1)
//             if(sec1)
//             setsq(sec1)
//             if(thir1)
//             settq(thir1)
//             if(compo1)
//             setcomplete(compo1)
//             if(spentdodal){
//                 setspentOffline(spentdodal/usinr)
//             }
//         })
//         .catch(err =>{
//             console.log(err)
//         })
//     }
// },[ids])
// const offlineReports = (logs,imp,clck,firq,secq,thirq,compo) => {
//     fetch('/offreport/sumreportofcam22',{
//         method:'put',
//         headers:{
//             "Content-Type":"application/json",
//             "Authorization" :"Bearer "+localStorage.getItem("jwt")
//         },body:JSON.stringify({
//             campaignId:ids.audio
//         })
//     }).then(res=>res.json())
//     .then(result=>{
//         var impressions1 = imp;
//         var clicks1 = clck;
//         var firt1 = firq;
//         var sec1 = secq;
//         var thir1 = thirq;
//         var compo1 = compo;
//         var logss = result;
//         // console.log(result)
//         result.map((re)=>{
//             if(re.appId==='5b2210af504f3097e73e0d8b'|| re.appId === '5d10c405844dd970bf41e2af')
//             re.nameads = 'Offline'
//             impressions1 += re.impressions
//             clicks1 += re.clicks
//             firt1 += re.firstQuartile ? re.firstQuartile : 0
//             sec1 += re.midpoint ? re.midpoint : 0
//             thir1 += re.thirdQuartile ? re.thirdQuartile : 0
//             compo1 += re.complete ? re.complete : 0
//         })
//         logss = logss.concat(logs)
//         logss = logss.filter(x => x.impressions!==0)
//         logss = logss.sort(function(a,b){
//             var d1 = new Date(a.updatedAt[0])
//             var d2 = new Date(b.updatedAt[0])
//             return d2 - d1
//         })
//         // console.log(logss)
//         if(logss.length)
//         setlogs(logss)
//         if(impressions1)
//         setimpre(impressions1)
//         if(clicks1)
//         setclick(clicks1)
//         if(firt1)
//         setfq(firt1)
//         if(sec1)
//         setsq(sec1)
//         if(thir1)
//         settq(thir1)
//         if(compo1)
//         setcomplete(compo1)
//     })
//     .catch(err =>{
//         console.log(err)
//     })
// }
// // logs puller for display campaigns
// useEffect(()=>{
//     if(ids && ids.display){
//         fetch('/offreport/sumreportofcam22',{
//             method:'put',
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
//             },body:JSON.stringify({
//                 campaignId:ids.display
//             })
//         }).then(res=>res.json())
//         .then(result=>{
//             var impressions1 = 0;
//             var clicks1 = 0;
//             var spentdodal = 0;
//             var logss = result;
//             // console.log(result)
//             result.map((re)=>{
//                 if(re.Publisher && re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher && re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
//                     re.nameads = 'Offline'
//                     if(re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
//                         spentdodal += parseInt(re.impressions)*4.25/100
//                     }
//                     // Wynk
//                     if(re.Publisher._id.toString() === '5b2210af504f3097e73e0d8b'){
//                         spentdodal += parseInt(re.impressions)*10/100
//                     }
//                 }
//                 impressions1 += re.impressions
//                 clicks1 += re.clicks
//             })
//             logss = logss.sort(function(a,b){
//                 var d1 = new Date(a.updatedAt[0])
//                 var d2 = new Date(b.updatedAt[0])
//                 return d2 - d1
//             })
//             console.log(logss)
//             if(logss.length)
//             setlogsd(logss)
//             if(impressions1)
//             setimpred(impressions1)
//             if(clicks1)
//             setclickd(clicks1)
//             if(spentdodal){
//                 setspentOfflined(spentdodal/usinr)
//             }
//         })
//         .catch(err =>{
//             console.log(err)
//         })
//     }
// },[ids])
// const offlineReportsd = (logs,imp,clck) => {
//     fetch('/offreport/sumreportofcam22',{
//         method:'put',
//         headers:{
//             "Content-Type":"application/json",
//             "Authorization" :"Bearer "+localStorage.getItem("jwt")
//         },body:JSON.stringify({
//             campaignId:ids.display
//         })
//     }).then(res=>res.json())
//     .then(result=>{
//         var impressions1 = imp;
//         var clicks1 = clck;
//         var logss = result;
//         // console.log(result)
//         result.map((re)=>{
//             if(re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
//                 re.nameads = 'Offline'
//             }impressions1 += re.impressions
//             clicks1 += re.clicks
//         })
//         logss = logss.concat(logs)
//         logss = logss.sort(function(a,b){
//             var d1 = new Date(a.updatedAt[0])
//             var d2 = new Date(b.updatedAt[0])
//             return d2 - d1
//         })
//         // console.log(logss)
//         if(logss.length)
//         setlogsd(logss)
//         if(impressions1)
//         setimpred(impressions1)
//         if(clicks1)
//         setclickd(clicks1)
//     })
//     .catch(err =>{
//         console.log(err)
//     })
// }
// // logs puller for video campaigns
// useEffect(()=>{
//     if(ids && ids.video){
//         fetch('/offreport/sumreportofcam22',{
//             method:'put',
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
//             },body:JSON.stringify({
//                 campaignId:ids.video
//             })
//         }).then(res=>res.json())
//         .then(result=>{
//             var impressions1 = 0;
//             var clicks1 = 0;
//             var spentdodal = 0;
//             var logss = result;
//             // console.log(result)
//             result.map((re)=>{
//                 if(re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
//                     re.nameads = 'Offline'
//                     if(re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
//                         spentdodal += parseInt(re.impressions)*4.25/100
//                     }
//                     // Wynk
//                     if(re.Publisher._id.toString() === '5b2210af504f3097e73e0d8b'){
//                         spentdodal += parseInt(re.impressions)*10/100
//                     }
//                 }impressions1 += re.impressions
//                 clicks1 += re.clicks
//             })
//             logss = logss.sort(function(a,b){
//                 var d1 = new Date(a.updatedAt[0])
//                 var d2 = new Date(b.updatedAt[0])
//                 return d2 - d1
//             })
//             // console.log(logss)
//             if(logss.length)
//             setlogsv(logss)
//             if(impressions1)
//             setimprev(impressions1)
//             if(clicks1)
//             setclickv(clicks1)
//             if(spentdodal){
//                 setspentOfflinev(spentdodal/usinr)
//             }
//         })
//         .catch(err =>{
//             console.log(err)
//         })
//     }
// },[ids])
