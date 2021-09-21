import {
	Button,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IdContext } from '../App';
// import IconBreadcrumbs from './breadBreed';
// import Auditable from './auditable.js';
import { useSelector } from 'react-redux';
import ReactExport from 'react-data-export';
import PinClient from './PinClient';
import CategoryClinet from './CategoryClinet';
import Creative_Report from './creative_report_client';
import PhoneModelClinet from './PhoneClient';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import {
	CreativeBody,
	CreativeHead,
	PincodeHead,
	PincodeClientBody,
	IBAClientHead,
	IBAClientBody,
	PhoneModelClientHead,
	PhoneModelClientBody,
	SumDetClientHead,
	SumDetClientBody
} from './CommonFun';
import { useHistory } from 'react-router';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export default function BasicTable({ title, id, adminView }) {
	const { state1 } = useContext(IdContext);
	const history = useHistory();
	// const [logs, setlogs] = useState([])
	const [ ids, setids ] = useState({});
	// const [ audioReport, setaudioReport ] = useState({});
	// const [ displayReport, setdisplayReport ] = useState({});
	// const [ videoReport, setvideoReport ] = useState({});
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
	const [ uniqueData, setuniqueData ] = useState({});
	const [ categoryData, setcategoryData ] = useState({});
	const [ categoryDataload, setcategoryDataload ] = useState(true);
	const [ categoryDataerr, setcategoryDataerr ] = useState(false);
	const [ creativeData, setcreativeData ] = useState([]);
	const [ creativeDataload, setcreativeDataload ] = useState(true);
	const [ creativeDataerr, setcreativeDataerr ] = useState(false);
	const [ phoneModelData, setphoneModelData ] = useState({});
	const [ pincodeData, setpincodeData ] = useState({});
	const [ pincodeDataload, setpincodeDataload ] = useState(true);
	const [ pincodeDataerr, setpincodeDataerr ] = useState(false);
	const classes = useStyles();
	const report = useSelector((state) => state.report);
	useEffect(
		() => {
			if (report && report.report && report.report.complete) {
				uniqueSetter();
				setlastUpdated(report.report.complete.updatedAt);
				PincodeSetter();
				// Creativedata();
				CategorySetter();
				DeviceSetter();
			}
		},
		[ report ]
	);
	async function PincodeSetter() {
		var sets = report.sets;
		var ids = report.grp_ids;
		var data = {};
		// console.log(sets.length);
		for (var i = 0; i < sets.length; i++) {
			if (ids[sets[i]].length) {
				console.log(ids[sets[i]]);
				await fetch('/subrepo/pinbycampids', {
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
					})
					.catch((err) => {
						setpincodeDataerr(true);
						console.log(err);
					});
			}
		}
		setpincodeData(data);
	}
	async function CategorySetter() {
		var sets = report.sets;
		var ids = report.cateids;
		var data = {};
		for (var i = 0; i < sets.length; i++) {
			if (ids[sets[i]])
				if (ids[sets[i]].length) {
					console.log(ids[sets[i]]);
					await fetch('/subrepo/categorywiseids', {
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
						})
						.catch((err) => {
							setpincodeDataerr(true);
							console.log(err);
						});
				}
		}
		setcategoryData(data);
		setcategoryDataload(false);
	}
	async function DeviceSetter() {
		var sets = report.sets;
		var ids = report.grp_ids;
		var data = {};
		// console.log(report);
		for (var i = 0; i < sets.length; i++) {
			if (ids[sets[i]].length) {
				console.log(ids[sets[i]]);
				await fetch('/subrepo/phoneModelbycampids', {
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
					})
					.catch((err) => {
						setpincodeDataerr(true);
						console.log(err);
					});
			}
		}
		setphoneModelData(data);
	}
	async function uniqueSetter() {
		var sets = report.sets;
		var ids = report.grp_ids;
		var data = {};
		data['complete'] = { users: 0 };
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
						data['complete'].users += result.length
							? result[0].users != undefined ? result[0].users : 0
							: 0;
						data[sets[i]] = result[0];
					})
					.catch((err) => {
						setpincodeDataerr(true);
						console.log(err);
					});
			}
		}
		console.log(data);
		setuniqueData(data);
		// setcategoryDataload(false);
	}
	const Creativedata = () => {
		var idsa = report.ids.combined;
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
					setcreativeData(result);
					setcreativeDataload(false);
				})
				.catch((err) => console.log(err));
		}
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
		var s = new Date(new Date()).toString();
		// var datee = datee.toString();
		// console.log(s,date,s.split('/'))
		s = s.split(' ');
		// console.log(s);
		return s[2] + '-' + s[1] + '-' + s[3] + ' ' + s[4];
	};
	const updatedatetimeseterpin = (date) => {
		// console.log(date)
		// var datee = new Date(date);
		var s = new Date(new Date()).toString();
		// var datee = datee.toString();
		// console.log(s,date,s.split('/'))
		s = s.split(' ');
		// console.log(s);
		return s[2] + '-' + s[1] + '-' + s[3] + ' ' + '00:00:00';
	};
	const SummaryTable = (title, reportsub, target, users) => {
		// console.log(reportsub, target);
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
								<TableCell>Unique User</TableCell>
								<TableCell>Average Frequency</TableCell>
								<TableCell>Total Clicks Delivered till date</TableCell>
								<TableCell>CTR</TableCell>
								<TableCell>LTR</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>{dateformatchanger(report.startDate)}</TableCell>
								<TableCell>{dateformatchanger(report.endDate)}</TableCell>
								<TableCell>{timefinder(report.endDate, report.startDate)} days</TableCell>
								<TableCell>{target}</TableCell>
								<TableCell>{reportsub.impressions}</TableCell>
								<TableCell>{users}</TableCell>
								<TableCell>{Math.round(reportsub.impressions / users * 100) / 100}</TableCell>
								<TableCell>{reportsub.clicks + reportsub.clicks1}</TableCell>
								<TableCell>
									{Math.round(
										(reportsub.clicks + reportsub.clicks1) * 100 / reportsub.impressions * 100
									) / 100}%
								</TableCell>
								<TableCell>
									{Math.round(reportsub.complete * 100 / reportsub.impressions * 100) / 100}%
								</TableCell>
								<TableCell
									className="mangeads__report"
									onClick={() => {
										if (adminView) {
											history.push(`/clientSideCamp/${report.req_id}/summarydetailed`);
										} else {
											history.push(`/manageAds/${report.req_id}/summarydetailed`);
										}
									}}
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
						Download Tables{props.load ? <CircularProgress /> : ''}
					</Button>
				}
			>
				{data.map((child) => {
					return child;
				})}
			</ExcelFile>
		);
	}
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
					{ title: 'Total Impressions to be delivered' },
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
						{ value: target ? target : 0 },
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
	const QuartSum = [
		{
			ySteps: 1,
			xSteps: 5,
			columns: [ { title: 'Quartile Summery Report' } ],
			data: [ [ { value: '' } ] ]
		},
		{
			columns: [
				{ title: '' },
				{ title: 'First Quartile' },
				{ title: 'Second Quartile' },
				{ title: 'Third Quartile' },
				{ title: 'Complete' },
				{ title: 'LTR' }
			],
			data: [
				[
					{ value: 'impressions' },
					{ value: report.report.complete.firstQuartile },
					{ value: report.report.complete.midpoint },
					{ value: report.report.complete.thirdQuartile },
					{ value: report.report.complete.complete },
					{ value: Math.round(report.report.complete.ltr * 100) / 100 + '%' }
				]
			]
		}
	];
	const CompleteGen = () => {
		var vamp = [];
		var compo = SumReportGen(
			'Over All Summary',
			report.report['complete'],
			report.report.complete[`target`],
			uniqueData['complete'] ? uniqueData['complete'].users : 0
		);
		compo.map((x) => vamp.push(x));
		if (report.sets) {
			report.sets.map((x) => {
				var temp = SumReportGen(
					x,
					report.report[x],
					report.grp_ids[`${x}target`],
					uniqueData[x] ? uniqueData[x].users : 0
				);
				temp.map((x) => vamp.push(x));
			});
		}
		QuartSum.map((x) => vamp.push(x));
		return vamp;
	};
	const PinGen = () => {
		var vamp = {};
		report.sets.map((x) => {
			vamp[x] = [
				{
					columns: PincodeHead,
					data:
						report.grp_ids[x].length &&
						pincodeData[x] &&
						PincodeClientBody(
							pincodeData[x],
							report.report[x].impressions,
							report.report[x].clicks + report.report[x].clicks1
						)
				}
			];
		});
		return vamp;
	};
	const pinda = PinGen();
	const CategoryGen = () => {
		var vamp = {};
		report.sets.map((x) => {
			vamp[x] = [
				{
					columns: IBAClientHead,
					data:
						report.grp_ids[x].length &&
						categoryData[x] &&
						IBAClientBody(
							categoryData[x],
							report.report[x].impressions,
							report.report[x].clicks + report.report[x].clicks1
						)
				}
			];
		});
		return vamp;
	};
	const CateDat = CategoryGen();
	const phoneModelGen = () => {
		var vamp = {};
		report.sets.map((x) => {
			vamp[x] = [
				{
					columns: PhoneModelClientHead,
					data:
						report.grp_ids[x].length &&
						phoneModelData[x] &&
						PhoneModelClientBody(
							phoneModelData[x],
							report.report[x].impressions,
							report.report[x].clicks + report.report[x].clicks1
						)
				}
			];
		});
		return vamp;
	};
	const phonedat = phoneModelGen();
	// const CreativeDown = [
	// 	{
	// 		columns: CreativeHead,
	// 		data: report.ids.combined && creativeData && creativeData.length && CreativeBody(creativeData)
	// 	}
	// ];
	const DateGen = () => {
		var vamp = {};
		report.sets.map((x) => {
			vamp[x] = [
				{
					columns: SumDetClientHead,
					data:
						!report.issumdetLoading &&
						report.grp_ids[x].length &&
						report.sumdetreport[x] &&
						SumDetClientBody(
							report.sumdetreport[x],
							report.report[x].impressions,
							report.report[x].clicks + report.report[x].clicks1
						)
				}
			];
		});
		return vamp;
	};
	const datesumda = DateGen();
	return (
		<React.Fragment>
			{/* <IconBreadcrumbs /> */}
			<div className="titleReport">{title && title.toUpperCase()} Campaign</div>
			<div className="titleReport">Overall Summary Report</div>
			<ExeclDownload filename={`Complete Report ${title}`} load={report.issumdetLoading}>
				<ExcelSheet dataSet={CompleteGen()} must={true} name="Over all Summary Data" />
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={pinda[x]} name={`Pincode ${x} Wise`} />;
					})}
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={phonedat[x]} name={`PhoneModel ${x} Wise`} />;
					})}
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={CateDat[x]} name={`listener Profile Report ${x} Wise`} />;
					})}
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={datesumda[x]} name={`Daily Report ${x}`} />;
					})}
				{/* <ExcelSheet dataSet={CreativeDown} name="Creative Wise" /> */}
			</ExeclDownload>
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{SummaryTable(
				'Over All Summary',
				report.report['complete'],
				report.report.complete[`target`],
				uniqueData['complete'] ? uniqueData['complete'].users : 0
			)}
			{report.sets &&
				report.sets.map((x) => {
					return (
						<div>
							{SummaryTable(
								x,
								report.report[x],
								report.grp_ids[`${x}target`],
								uniqueData[x] ? uniqueData[x].users : 0
							)}
						</div>
					);
				})}
			<div className="titleReport">Quartile Summary Report</div>
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
							<TableCell>LTR</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>Impressions</TableCell>
							<TableCell>{report.report.complete.firstQuartile}</TableCell>
							<TableCell>{report.report.complete.midpoint}</TableCell>
							<TableCell>{report.report.complete.thirdQuartile}</TableCell>
							<TableCell>{report.report.complete.complete}</TableCell>
							<TableCell>{Math.round(report.report.complete.ltr * 100) / 100}%</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<div className="titleReport">Pincode Wise Summary Report</div>
			{/* <ExeclDownload filename={`Pincode Wise Report ${title}`}>
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={pinda[x]} name={`Pincode ${x} Wise`} />;
					})}
			</ExeclDownload> */}
			<div>last updated at - {lastUpdated ? updatedatetimeseterpin(lastUpdated) : 'Not found'}</div>
			{report.sets &&
				report.sets.map((x) => {
					if (report.grp_ids[x].length) {
						if (pincodeData[x]) {
							return (
								<PinClient
									report={pincodeData[x]}
									head={x}
									title={title && title.toUpperCase()}
									state1={id}
									impression={report.report[x].impressions}
									clicks={report.report[x].clicks + report.report[x].clicks1}
								/>
							);
						} else {
							return (
								<Paper>
									<CircularProgress />
								</Paper>
							);
						}
					}
				})}
			<div className="titleReport">Device Type Wise Summary Report</div>
			{/* <ExeclDownload filename={`Device Type Wise Report ${title}`}>
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={phonedat[x]} name={`PhoneModel ${x} Wise`} />;
					})}
			</ExeclDownload> */}
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{report.sets &&
				report.sets.map((x) => {
					if (report.grp_ids[x].length) {
						if (phoneModelData[x]) {
							return (
								<PhoneModelClinet
									report={phoneModelData[x]}
									head={x}
									title={title && title.toUpperCase()}
									state1={id}
									impression={report.report[x].impressions}
									clicks={report.report[x].clicks + report.report[x].clicks1}
								/>
							);
						} else {
							return (
								<Paper>
									<CircularProgress />
								</Paper>
							);
						}
					}
				})}
			<div className="titleReport">Listener Profiling Report</div>
			{/* <ExeclDownload filename={`Listener Profiling Report ${title}`}>
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={CateDat[x]} name={`Category ${x} Wise`} />;
					})}
			</ExeclDownload> */}
			<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
			{report.sets &&
				report.sets.map((x) => {
					if (report.cateids[x] && report.cateids[x].length) {
						if (categoryData[x]) {
							return (
								<CategoryClinet
									report={categoryData[x]}
									head={x}
									title={title && title.toUpperCase()}
									state1={id}
									impression={report.report[x].impressions}
									clicks={report.report[x].clicks + report.report[x].clicks1}
								/>
							);
						} else {
							return (
								<Paper>
									<CircularProgress />
								</Paper>
							);
						}
					}
				})}
			{/* {creativeData.length ? (
				<div>
					<div className="titleReport">Creative Wise Summary Report</div>
					<div>last updated at - {lastUpdated ? updatedatetimeseter(lastUpdated) : 'Not found'}</div>
					<Creative_Report
						// title="Audio"
						state1={report.req_id}
						arrowRetuner={arrowRetuner}
						report={creativeData}
						impression={report.report['complete'].impressions}
						clicks={report.report['complete'].clicks + report.report['complete'].clicks1}
					/>
				</div>
			) : (
				''
			)} */}
		</React.Fragment>
	);
}

// console.log(singlead)
// useEffect(
// 	() => {
// 		if (singlead && singlead.id_final) {
// 			setids(singlead.id_final);
// 			// logsPuller(singlead.id_final);
// 		}
// 	},
// 	[ singlead ]
// );
// logs puller
// const logsPuller = (idData) => {
// 	console.log(idData);
// 	fetch('/offreport/sumreportofcamall', {
// 		method: 'put',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 		},
// 		body: JSON.stringify({
// 			campaignId: idData
// 		})
// 	})
// 		.then((res) => res.json())
// 		.then((resulta) => {
// 			var result = resulta;
// 			console.log(result);
// 			setlastUpdated(result.allrecentupdate);
// 			setaudioReport(result.audioCompleteReport);
// 			setdisplayReport(result.displayCompleteReport);
// 			setvideoReport(result.videoCompleteReport);
// 			setimpre(result.audioCompleteReport.impressions);
// 			setimpred(result.displayCompleteReport.impressions);
// 			setimprev(result.videoCompleteReport.impressions);
// 			setclick(result.audioCompleteReport.clicks);
// 			setclickd(result.displayCompleteReport.clicks);
// 			setclickv(result.videoCompleteReport.clicks);
// 			// setcomplete(result.audioCompleteReport.complete)
// 			// setfq(result.audioCompleteReport.firstQuartile)
// 			// setsq(result.audioCompleteReport.midpoint)
// 			// settq(result.audioCompleteReport.thirdQuartile)
// 			// setaudiologs(result.audio)
// 			// setdisplaylogs(result.display)
// 			// setvideologs(result.video)
// 		})
// 		.catch((err) => console.log(err));
// };
