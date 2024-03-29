import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import {
	LoadPublisherData,
	orderManagerPublisherData,
	PublisherLoading,
	LoadUniqueUsersData,
	LoadDynamicReportTest,
	searchPublisherData,
	storepaginationPublisherData,
	DynamicPublisherLoading
} from '../redux/actions/ConsoledateActions';
import { LoadQuartileData } from '../redux/actions/SeperateActions';
import PreLoader from '../components/loaders/PreLoader';
// import SearchCampagin from '../components/SearchCampagin';
// import { CSVLink } from 'react-csv';
import PublisherConsoleTable from '../components/PublisherConsoleTable';
import QuartilePublisherCon from '../components/QuartileCon';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import {
	ConsolePhoneBody,
	Consoleheaders,
	ConsoleheadersAudio,
	QuartileHead,
	QuartileBodyCon,
	ConsolePhoneBodyAudio
} from '../components/CommonFun';
import ReactExport from 'react-data-export';
import BasicDateRangePicker from '../components/dateRangepicker';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

function PublisherConsole() {
	const dispatchRedux = useDispatch();
	const consoledata = useSelector((state) => state.consoleDateReport);
	const quartiledata = useSelector((state) => state.quartile);
	const [ startDate, setstartDate ] = React.useState('');
	const [ endDate, setendDate ] = React.useState('');
	// const [ searchval, setSearchval ] = useState('');
	useEffect(() => {
		if (
			consoledata &&
			(!consoledata.audiopublisherData || !consoledata.displaypublisherData || !consoledata.videopublisherData)
		) {
			dispatchRedux(PublisherLoading());
			dispatchRedux(LoadPublisherData());
			dispatchRedux(LoadUniqueUsersData());
			// dispatchRedux(LoadDynamicReportTest());
			// dispatchRedux(LoadQuartileData());
		}
		// if (consoledata && consoledata.publisherDataValue) {
		// 	setSearchval(consoledata.publisherDataValue);
		// }
	}, []);
	// const onChangeRedux = (val) => {
	// 	dispatchRedux(searchPublisherData(val));
	// 	setSearchval(val);
	// };
	// const [ rowsPerPage, setRowsPerPage ] = useState(consoledata.publisherDataRPP);
	// const [ page, setPage ] = useState(consoledata.publisherDataPagination);
	// const [ sa, setsa ] = useState(consoledata.publisherDataordername);
	// const [ order, setorder ] = useState(consoledata.publisherDataorderdir);
	// const [ adss, setadss ] = useState(consoledata.searchedpublisherData);
	const headersAudio = [
		{ key: 'publisherName', label: 'Publisher' },
		{ key: 'apppubid', label: 'PublisherId' },
		{ key: 'ssp', label: 'SSP' },
		{ key: 'fede', label: 'Feed' },
		{ key: 'useage', label: 'User Agent' },
		{ key: 'req', label: 'Requests' },
		{ key: 'avgreq', label: 'Average Requests' },
		{ key: 'unique', label: 'Unique Users' },
		{ key: 'uniquef', label: 'Average Frequency' },
		{ key: 'overlap', label: '% Over Lap' },
		{ key: 'impression', label: 'Total Impressions Delivered till date' },
		{ key: 'avgimpre', label: 'Average Impressions' },
		{ key: 'click', label: 'Total Clicks Delivered till date' },
		{ key: 'ctr', label: 'CTR' }
	];
	const headers = [
		{ key: 'publisherName', label: 'Publisher' },
		{ key: 'apppubid', label: 'PublisherId' },
		{ key: 'ssp', label: 'SSP' },
		{ key: 'fede', label: 'Feed' },
		{ key: 'unique', label: 'Unique Users' },
		{ key: 'uniquef', label: 'Average Frequency' },
		{ key: 'overlap', label: '% Over Lap' },
		{ key: 'impression', label: 'Total Impressions Delivered till date' },
		{ key: 'avgimpre', label: 'Average Impressions' },
		{ key: 'click', label: 'Total Clicks Delivered till date' },
		{ key: 'ctr', label: 'CTR' }
	];
	// var csvReport = {
	// 	filename: `PublisherData.csv`,
	// 	headers: headers,
	// 	data: adss
	// };
	// const handleChangePage = (event, newPage) => {
	// 	dispatchRedux(storepaginationPublisherData(newPage, rowsPerPage));
	// 	setPage(newPage);
	// };
	// const handleChangeRowsPerPage = (event) => {
	// 	dispatchRedux(storepaginationPublisherData(page, +event.target.value));
	// 	setRowsPerPage(+event.target.value);
	// 	setPage(0);
	// };
	// const tablesorter = (column, type) => {
	// 	var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
	// 	setorder(orde);
	// 	setsa(column);
	// 	var setData = orderSetter(orde, column, adss, type);
	// 	dispatchRedux(orderManagerPublisherData(orde, column));
	// 	setadss(setData);
	// };
	const arrowRetuner = (mode) => {
		if (mode === '1') {
			return <ArrowUpwardRoundedIcon fontSize="small" />;
		} else if (mode === '2') {
			return <ArrowDownwardRoundedIcon fontSize="small" />;
		} else {
			return <ArrowUpwardRoundedIcon fontSize="small" style={{ color: 'lightgrey' }} />;
		}
	};
	// useEffect(
	// 	() => {
	// 		if (consoledata.searchedpublisherData) {
	// 			setadss(consoledata.searchedpublisherData);
	// 			// tablesorter('impression', 'number');
	// 		}
	// 	},
	// 	[ consoledata ]
	// );
	// useEffect(
	// 	() => {
	// 		dispatchRedux(LTRLoad());
	// 	},
	// 	[ quartiledata ]
	// );
	if (consoledata.publisherDataLoading && quartiledata.publisherDataLoading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	const consoledataAudio = {
		publisherDataRPP: consoledata.audiopublisherDataRPP,
		publisherDataPagination: consoledata.audiopublisherDataPagination,
		publisherDataordername: consoledata.audiopublisherDataordername,
		publisherDataorderdir: consoledata.audiopublisherDataorderdir,
		publisherDataValue: consoledata.audiopublisherDataValue,
		searchedpublisherData: consoledata.audiosearchedpublisherData
	};
	const consoledatadisplay = {
		publisherDataRPP: consoledata.displaypublisherDataRPP,
		publisherDataPagination: consoledata.displaypublisherDataPagination,
		publisherDataordername: consoledata.displaypublisherDataordername,
		publisherDataValue: consoledata.displaypublisherDataValue,
		publisherDataorderdir: consoledata.displaypublisherDataorderdir,
		searchedpublisherData: consoledata.displaysearchedpublisherData
	};
	const consoledatavideo = {
		publisherDataRPP: consoledata.videopublisherDataRPP,
		publisherDataPagination: consoledata.videopublisherDataPagination,
		publisherDataordername: consoledata.videopublisherDataordername,
		publisherDataValue: consoledata.videopublisherDataValue,
		publisherDataorderdir: consoledata.videopublisherDataorderdir,
		searchedpublisherData: consoledata.videosearchedpublisherData
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
	const PhonComp = {
		audio: [
			{
				columns: ConsoleheadersAudio,
				data: consoledata.audiopublisherData && ConsolePhoneBodyAudio(consoledata.audiopublisherData)
			}
		],
		display: [
			{
				columns: Consoleheaders,
				data: consoledata.displaypublisherData && ConsolePhoneBody(consoledata.displaypublisherData)
			}
		],
		video: [
			{
				columns: Consoleheaders,
				data: consoledata.videopublisherData && ConsolePhoneBody(consoledata.videopublisherData)
			}
		]
	};
	const QuartileDown = {
		audio: [
			{
				columns: QuartileHead,
				data:
					quartiledata.quartileaudiopublisherData && QuartileBodyCon(quartiledata.quartileaudiopublisherData)
			}
		],
		video: [
			{
				columns: QuartileHead,
				data:
					quartiledata.quartilevideopublisherData && QuartileBodyCon(quartiledata.quartilevideopublisherData)
			}
		]
	};
	const quat = {
		audio: quartiledata.quartileaudiopublisherData,
		video: quartiledata.quartilevideopublisherData
	};
	console.log(consoledata);
	// console.log(consoledata.uniqueusersloading);
	return (
		<div>
			<div className="heading">
				Publisher Wise Data<br />
				<ExeclDownload filename={`Complete Report Publisher wise`}>
					<ExcelSheet dataSet={PhonComp.audio} name="Complete Publisher Audio Wise" />
					<ExcelSheet dataSet={PhonComp.display} name="Complete Publisher Display Wise" />
					<ExcelSheet dataSet={PhonComp.video} name="Complete Publisher Video Wise" />
					<ExcelSheet dataSet={QuartileDown.audio} name="Complete Quartile Publisher Audio Wise" />
					<ExcelSheet dataSet={QuartileDown.video} name="Complete Quartile Publisher Video Wise" />
				</ExeclDownload>
			</div>
			<Paper className="tableCont tabledatemain">
				<BasicDateRangePicker setstartDate={setstartDate} setendDate={setendDate} />
				<Button
					color="primary"
					variant="contained"
					style={{ margin: '5px' }}
					onClick={() => {
						dispatchRedux(DynamicPublisherLoading());
						dispatchRedux(LoadDynamicReportTest(startDate, endDate));
						console.log({ startDate, endDate });
					}}
				>
					Submit
				</Button>
				{consoledata && consoledata.dynamicpublisherDataLoading ? (
					''
				) : (
					<ExeclDownload
						filename={`Complete Report Publisher ${consoledata.dynamicpublisherData
							? consoledata.dynamicpublisherData.startDate
							: 0} to ${consoledata.dynamicpublisherData ? consoledata.dynamicpublisherData.endDate : 0}`}
					>
						<ExcelSheet dataSet={consoledata.dynamicpublisherData.summary} name="Overall Summary Report" />
						<ExcelSheet
							dataSet={consoledata.dynamicpublisherData.publishAudio}
							name="Complete Publisher Audio Wise"
						/>
						<ExcelSheet
							dataSet={consoledata.dynamicpublisherData.publishDisplay}
							name="Complete Publisher Display Wise"
						/>
						<ExcelSheet
							dataSet={consoledata.dynamicpublisherData.publishVideo}
							name="Complete Publisher Video Wise"
						/>
						<ExcelSheet
							dataSet={consoledata.dynamicpublisherData.quartileAudio}
							name="Complete Quartile Publisher Audio Wise"
						/>
						<ExcelSheet
							dataSet={consoledata.dynamicpublisherData.quartileVideo}
							name="Complete Quartile Publisher Video Wise"
						/>
					</ExeclDownload>
				)}
			</Paper>
			{consoledata &&
			!consoledata.uniqueusersloading && (
				<div>
					<Paper className="tableCont tablemargin">
						<div>Overall Summary Report</div>
						<TableContainer className="smallTableRow">
							<TableHead>
								<TableRow>
									<TableCell>Total Impressions</TableCell>
									<TableCell>Average Impressions</TableCell>
									<TableCell>Unique Users</TableCell>
									<TableCell>Average Frequency</TableCell>
									<TableCell>% Over Lap</TableCell>
									<TableCell>Total Clicks</TableCell>
									<TableCell>CTR</TableCell>
									<TableCell>LTR</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>{consoledata.totalpublisherData.complete.impressions}</TableCell>
									<TableCell>{consoledata.totalpublisherData.complete.avgimpressions}</TableCell>
									<TableCell>{consoledata.totalpublisherData.complete.uniqueusers}</TableCell>
									<TableCell>{consoledata.totalpublisherData.complete.avgfreq}</TableCell>
									<TableCell>
										{Math.round(
											consoledata.totalpublisherData.complete.uniqueusers *
												100 *
												100 /
												(consoledata.uniqueusersdata.audio +
													consoledata.uniqueusersdata.display +
													consoledata.uniqueusersdata.video)
										) / 100}%
									</TableCell>
									<TableCell>{consoledata.totalpublisherData.complete.clicks}</TableCell>
									<TableCell>{consoledata.totalpublisherData.complete.ctr}%</TableCell>
									<TableCell>{consoledata.totalpublisherData.complete.ltr}%</TableCell>
								</TableRow>
							</TableBody>
						</TableContainer>
					</Paper>
					<Paper className="tableCont tablemargin">
						<div>Overall Audio Report</div>
						<TableContainer className="smallTableRow">
							<TableHead>
								<TableRow>
									<TableCell>Requests</TableCell>
									<TableCell>Average Requests</TableCell>
									<TableCell>Total Impressions</TableCell>
									<TableCell>Average Impressions</TableCell>
									<TableCell>Unique Users</TableCell>
									<TableCell>Average Frequency</TableCell>
									<TableCell>% Over Lap</TableCell>
									<TableCell>Total Clicks</TableCell>
									<TableCell>CTR</TableCell>
									<TableCell>LTR</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>{consoledata.totalpublisherData.audio.requests}</TableCell>
									<TableCell>{consoledata.totalpublisherData.audio.avgrequest}</TableCell>
									<TableCell>{consoledata.totalpublisherData.audio.impressions}</TableCell>
									<TableCell>{consoledata.totalpublisherData.audio.avgimpressions}</TableCell>
									<TableCell>{consoledata.uniqueusersdata.audio}</TableCell>
									<TableCell>{consoledata.totalpublisherData.audio.avgfreq}</TableCell>
									<TableCell>
										{Math.round(
											consoledata.totalpublisherData.audio.uniqueusers *
												100 /
												consoledata.uniqueusersdata.audio *
												100
										) / 100}%
									</TableCell>
									<TableCell>{consoledata.totalpublisherData.audio.clicks}</TableCell>
									<TableCell>{consoledata.totalpublisherData.audio.ctr}%</TableCell>
									<TableCell>{consoledata.totalpublisherData.audio.ltr}%</TableCell>
								</TableRow>
							</TableBody>
						</TableContainer>
					</Paper>
					<Paper className="tableCont tablemargin">
						<div>Overall Display Report</div>
						<TableContainer className="smallTableRow">
							<TableHead>
								<TableRow>
									<TableCell>Total Impressions</TableCell>
									<TableCell>Average Impressions</TableCell>
									<TableCell>Unique Users</TableCell>
									<TableCell>Average Frequency</TableCell>
									<TableCell>% Over Lap</TableCell>
									<TableCell>Total Clicks</TableCell>
									<TableCell>CTR</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>{consoledata.totalpublisherData.display.impressions}</TableCell>
									<TableCell>{consoledata.totalpublisherData.display.avgimpressions}</TableCell>
									<TableCell>{consoledata.uniqueusersdata.display}</TableCell>
									<TableCell>{consoledata.totalpublisherData.display.avgfreq}</TableCell>
									<TableCell>
										{Math.round(
											consoledata.totalpublisherData.display.uniqueusers *
												100 /
												consoledata.uniqueusersdata.display *
												100
										) / 100}%
									</TableCell>
									<TableCell>{consoledata.totalpublisherData.display.clicks}</TableCell>
									<TableCell>{consoledata.totalpublisherData.display.ctr}%</TableCell>
								</TableRow>
							</TableBody>
						</TableContainer>
					</Paper>
					<Paper className="tableCont tablemargin">
						<div>Overall Video Report</div>
						<TableContainer className="smallTableRow">
							<TableHead>
								<TableRow>
									<TableCell>Total Impressions</TableCell>
									<TableCell>Average Impressions</TableCell>
									<TableCell>Unique Users</TableCell>
									<TableCell>Average Frequency</TableCell>
									<TableCell>% Over Lap</TableCell>
									<TableCell>Total Clicks</TableCell>
									<TableCell>CTR</TableCell>
									<TableCell>LTR</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>{consoledata.totalpublisherData.video.impressions}</TableCell>
									<TableCell>{consoledata.totalpublisherData.video.avgimpressions}</TableCell>
									<TableCell>{consoledata.uniqueusersdata.video}</TableCell>
									<TableCell>{consoledata.totalpublisherData.video.avgfreq}</TableCell>
									<TableCell>
										{Math.round(
											consoledata.totalpublisherData.video.uniqueusers *
												100 /
												consoledata.uniqueusersdata.video *
												100
										) / 100}%
									</TableCell>
									<TableCell>{consoledata.totalpublisherData.video.clicks}</TableCell>
									<TableCell>{consoledata.totalpublisherData.video.ctr}%</TableCell>
									<TableCell>{consoledata.totalpublisherData.video.ltr}%</TableCell>
								</TableRow>
							</TableBody>
						</TableContainer>
					</Paper>
				</div>
			)}
			<PublisherConsoleTable
				title="Audio"
				headers={headersAudio}
				consoledata={consoledataAudio}
				arrowRetuner={arrowRetuner}
				searchPublisherData={searchPublisherData.audio}
				orderManagerPublisherData={orderManagerPublisherData.audio}
				storepaginationPublisherData={storepaginationPublisherData.audio}
			/>
			<PublisherConsoleTable
				title="Display"
				headers={headers}
				consoledata={consoledatadisplay}
				arrowRetuner={arrowRetuner}
				searchPublisherData={searchPublisherData.display}
				orderManagerPublisherData={orderManagerPublisherData.display}
				storepaginationPublisherData={storepaginationPublisherData.display}
			/>
			<PublisherConsoleTable
				title="Video"
				headers={headers}
				consoledata={consoledatavideo}
				arrowRetuner={arrowRetuner}
				searchPublisherData={searchPublisherData.video}
				orderManagerPublisherData={orderManagerPublisherData.video}
				storepaginationPublisherData={storepaginationPublisherData.video}
			/>
			<div className="titleReport">Quartile Wise Data</div>
			<ExeclDownload filename={`Complete Report Publisher wise`}>
				<ExcelSheet dataSet={QuartileDown.audio} name="Complete Quartile Publisher Audio Wise" />
				<ExcelSheet dataSet={QuartileDown.video} name="Complete Quartile Publisher Video Wise" />
			</ExeclDownload>
			<br />
			<TableContainer className="tableCont" elevation={3} component={Paper}>
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
					{consoledata.CompletepublisherData && (
						<TableBody>
							<TableRow>
								<TableCell>Impressions</TableCell>
								<TableCell>{consoledata.CompletepublisherData.start}</TableCell>
								<TableCell>{consoledata.CompletepublisherData.firstQuartile}</TableCell>
								<TableCell>{consoledata.CompletepublisherData.midpoint}</TableCell>
								<TableCell>{consoledata.CompletepublisherData.thirdQuartile}</TableCell>
								<TableCell>{consoledata.CompletepublisherData.complete}</TableCell>
								<TableCell>{consoledata.CompletepublisherData.impression}</TableCell>
							</TableRow>
						</TableBody>
					)}
				</Table>
			</TableContainer>
			<QuartilePublisherCon title={'Audio'} report={quat.audio} arrowRetuner={arrowRetuner} />
			<QuartilePublisherCon title={'Video'} report={quat.video} arrowRetuner={arrowRetuner} />
		</div>
	);
}

export default PublisherConsole;

{
	/* <div className="tableCont">
	<SearchCampagin state={'client'} inval={searchval} setInval={onChangeRedux} />
	</div>
<Paper className="tableCont">
<TableContainer>
<Table aria-label="simple table">
<TableHead>
<TableRow>
<TableCell
						onClick={() => tablesorter('publisherName', 'string')}
						style={{ cursor: 'pointer' }}
					>
					Publisher
						{arrowRetuner(sa === 'publisherName' ? (order === 'asc' ? '1' : '2') : '3')}
						</TableCell>
						<TableCell onClick={() => tablesorter('ssp', 'string')} style={{ cursor: 'pointer' }}>
						SSP {arrowRetuner(sa === 'ssp' ? (order === 'asc' ? '1' : '2') : '3')}
						</TableCell>
					<TableCell onClick={() => tablesorter('feed', 'string')} style={{ cursor: 'pointer' }}>
					Feed {arrowRetuner(sa === 'feed' ? (order === 'asc' ? '1' : '2') : '3')}
					</TableCell>
					<TableCell
					onClick={() => tablesorter('impression', 'number')}
					style={{ cursor: 'pointer' }}
					>
					Total Impressions Delivered till date{' '}
					{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
					</TableCell>
					<TableCell onClick={() => tablesorter('click', 'number')} style={{ cursor: 'pointer' }}>
						Total Clicks Delivered till date{' '}
						{arrowRetuner(sa === 'click' ? (order === 'asc' ? '1' : '2') : '3')}
					</TableCell>
					<TableCell onClick={() => tablesorter('ctr', 'number')} style={{ cursor: 'pointer' }}>
						CTR {arrowRetuner(sa === 'ctr' ? (order === 'asc' ? '1' : '2') : '3')}
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
			{adss && adss.length ? (
				adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => {
						return (
							<TableRow key={i}>
							<TableCell>{log.publisherName}</TableCell>
							<TableCell>{log.ssp}</TableCell>
								<TableCell>{log.feed}</TableCell>
								<TableCell>{log.impression}</TableCell>
								<TableCell>{log.click}</TableCell>
								<TableCell>{Math.round(log.ctr * 100) / 100}%</TableCell>
								</TableRow>
								);
							})
							) : (
					''
					)}
			</TableBody>
			</Table>
			</TableContainer>
	<TablePagination
		rowsPerPageOptions={[ 5, 10, 25, 100, 1000 ]}
		component="div"
		count={adss ? adss.length : 0}
		rowsPerPage={rowsPerPage}
		page={page}
		onChangePage={handleChangePage}
		onChangeRowsPerPage={handleChangeRowsPerPage}
		/>
		</Paper> */
}

// import {
// 	Paper,
// 	Table,
// 	TableBody,
// 	TablePagination,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow
// } from '@material-ui/core';
// import { orderSetter } from '../redux/actions/manageadsAction';
