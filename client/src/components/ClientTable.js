import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IdContext } from '../App';
// import IconBreadcrumbs from './breadBreed';
import Auditable from './auditable.js';
import { useSelector } from 'react-redux';
import ReactExport from 'react-data-export';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export default function BasicTable({ singlead, title }) {
	const { state1 } = useContext(IdContext);
	// const [logs, setlogs] = useState([])
	const [ ids, setids ] = useState({});
	const [ audioReport, setaudioReport ] = useState({});
	const [ displayReport, setdisplayReport ] = useState({});
	const [ videoReport, setvideoReport ] = useState({});
	const [ lastUpdated, setlastUpdated ] = useState('');
	// const [audiologs, setaudiologs] = useState([])
	// const [displaylogs, setdisplaylogs] = useState([])
	// const [videologs, setvideologs] = useState([])
	// const [fq, setfq] = useState(0)
	// const [sq, setsq] = useState(0)
	// const [tq, settq] = useState(0)
	// const [complete, setcomplete] = useState(0)
	const [ impre, setimpre ] = useState(0);
	const [ click, setclick ] = useState(0);
	const [ impred, setimpred ] = useState(0);
	const [ clickd, setclickd ] = useState(0);
	const [ imprev, setimprev ] = useState(0);
	const [ clickv, setclickv ] = useState(0);
	const classes = useStyles();
	const report = useSelector((state) => state.report);
	// console.log(singlead)
	useEffect(
		() => {
			if (singlead && singlead.id_final) {
				setids(singlead.id_final);
				logsPuller(singlead.id_final);
			}
		},
		[ singlead ]
	);
	// logs puller
	const logsPuller = (idData) => {
		console.log(idData);
		fetch('/offreport/sumreportofcamall', {
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
				setaudioReport(result.audioCompleteReport);
				setdisplayReport(result.displayCompleteReport);
				setvideoReport(result.videoCompleteReport);
				setimpre(result.audioCompleteReport.impressions);
				setimpred(result.displayCompleteReport.impressions);
				setimprev(result.videoCompleteReport.impressions);
				setclick(result.audioCompleteReport.clicks);
				setclickd(result.displayCompleteReport.clicks);
				setclickv(result.videoCompleteReport.clicks);
				// setcomplete(result.audioCompleteReport.complete)
				// setfq(result.audioCompleteReport.firstQuartile)
				// setsq(result.audioCompleteReport.midpoint)
				// settq(result.audioCompleteReport.thirdQuartile)
				// setaudiologs(result.audio)
				// setdisplaylogs(result.display)
				// setvideologs(result.video)
			})
			.catch((err) => console.log(err));
	};
	const timefinder = (da1, da2) => {
		var d1 = new Date(da1);
		var d2 = new Date(da2);
		if (d1 < d2) {
			return 'completed campaign';
		}
		var show = d1.getTime() - d2.getTime();
		var resula = show / (1000 * 3600 * 24);
		return Math.round(resula * 1) / 1;
	};
	const dateformatchanger = (date) => {
		var dategot = date && date.toString();
		var datechanged = dategot && dategot.slice(8, 10) + '-' + dategot.slice(5, 7) + '-' + dategot.slice(0, 4);
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
	const SummaryTable = (title, reportsub, target) => {
		console.log(reportsub, target);
		if (reportsub && reportsub.message) {
			return;
		}
		return (
			<TableContainer style={{ margin: '20px 0' }} elevation={3} component={Paper}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
				{report.req_id && reportsub && report.ids ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Campaign Start Date</TableCell>
								<TableCell>Campaign End Date</TableCell>
								<TableCell>Total Days of Campaign</TableCell>
								<TableCell>Total Impressions to be delivered</TableCell>
								<TableCell>Total Impressions Delivered till date</TableCell>
								<TableCell>Total Clicks Delivered till date</TableCell>
								<TableCell>CTR</TableCell>
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
								<TableCell>{dateformatchanger(report.startDate)}</TableCell>
								<TableCell>{dateformatchanger(report.endDate)}</TableCell>
								<TableCell>{timefinder(report.endDate, report.startDate)} days</TableCell>
								<TableCell>{target}</TableCell>
								<TableCell>{reportsub.impressions}</TableCell>
								<TableCell>{reportsub.clicks}</TableCell>
								<TableCell>
									{Math.round(reportsub.clicks * 100 / reportsub.impressions * 100) / 100}%
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
		<React.Fragment>
			{/* <IconBreadcrumbs /> */}
			<div className="titleReport">{title && title.toUpperCase()} Campaign</div>
			<div className="titleReport">Overall Summary Report</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{report.sets &&
				report.sets.map((x) => {
					return <div>{SummaryTable(x, report.report[x], report.grp_ids[`${x}target`])}</div>;
				})}
			{/* {SummaryTable('Audio', audioReport, ids && ids.audimpression)}
			{SummaryTable('Display', displayReport, ids && ids.disimpression)}
			{SummaryTable('Video', videoReport, ids && ids.vidimpression)} */}
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Platform Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			<Auditable
				adtype="Audio"
				state1={state1}
				streamingads={singlead}
				title="Platform"
				regtitle="phonePlatform"
				jsotitle="platformType"
				ids={ids && ids.audio}
				click={click}
				impression={impre}
				client={true}
				url="platformTypebycampids"
			/>
			<Auditable
				adtype="Display"
				state1={state1}
				streamingads={singlead}
				title="Platform"
				regtitle="phonePlatform"
				jsotitle="platformType"
				ids={ids && ids.display}
				click={clickd}
				impression={impred}
				client={true}
				url="platformTypebycampids"
			/>
			<Auditable
				adtype="Video"
				state1={state1}
				streamingads={singlead}
				title="Platform"
				regtitle="phonePlatform"
				jsotitle="platformType"
				ids={ids && ids.video}
				click={clickv}
				impression={imprev}
				client={true}
				url="platformTypebycampids"
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
				Pincode Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			<Auditable
				adtype="Audio"
				state1={state1}
				streamingads={singlead}
				title="Pincode"
				regtitle="pincode"
				jsotitle="zip"
				ids={ids && ids.audio}
				click={click}
				impression={impre}
				client={true}
				url="zipbycampids"
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
				Device Wise Summary Report
			</div>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			<Auditable
				adtype="Audio"
				state1={state1}
				streamingads={singlead}
				title="Device"
				regtitle="deviceModel"
				jsotitle="pptype"
				ids={ids && ids.audio}
				click={click}
				impression={impre}
				client={true}
				url="pptypebycampids"
			/>
			<Auditable
				adtype="Display"
				state1={state1}
				streamingads={singlead}
				title="Device"
				regtitle="deviceModel"
				jsotitle="pptype"
				ids={ids && ids.display}
				click={clickd}
				impression={impred}
				client={true}
				url="pptypebycampids"
			/>
			<Auditable
				adtype="Video"
				state1={state1}
				streamingads={singlead}
				title="Device"
				regtitle="deviceModel"
				jsotitle="pptype"
				ids={ids && ids.video}
				click={clickv}
				impression={imprev}
				client={true}
				url="pptypebycampids"
			/>
		</React.Fragment>
	);
}
