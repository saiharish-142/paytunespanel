import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import {
	LoadPublisherData,
	orderManagerPublisherData,
	PublisherLoading,
	searchPublisherData,
	storepaginationPublisherData
} from '../redux/actions/ConsoledateActions';
import { LoadQuartileData } from '../redux/actions/SeperateActions';
import PreLoader from '../components/loaders/PreLoader';
// import SearchCampagin from '../components/SearchCampagin';
// import { CSVLink } from 'react-csv';
import PublisherConsoleTable from '../components/PublisherConsoleTable';
import QuartilePublisherCon from '../components/QuartileCon';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import { ConsolePhoneBody, Consoleheaders, QuartileHead, QuartileBodyCon } from '../components/CommonFun';
import ReactExport from 'react-data-export';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

function PublisherConsole() {
	const dispatchRedux = useDispatch();
	const consoledata = useSelector((state) => state.consoleDateReport);
	const quartiledata = useSelector((state) => state.quartile);
	// const [ searchval, setSearchval ] = useState('');
	useEffect(() => {
		if (
			consoledata &&
			(!consoledata.audiopublisherData || !consoledata.displaypublisherData || !consoledata.videopublisherData)
		) {
			dispatchRedux(PublisherLoading());
			dispatchRedux(LoadPublisherData());
			dispatchRedux(LoadQuartileData());
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
	const headers = [
		{ key: 'publisherName', label: 'Publisher' },
		{ key: 'ssp', label: 'SSP' },
		{ key: 'feed', label: 'Feed' },
		{ key: 'impression', label: 'Total Impressions Delivered till date' },
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
				columns: Consoleheaders,
				data: consoledata.audiopublisherData && ConsolePhoneBody(consoledata.audiopublisherData)
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
	console.log(quartiledata);
	return (
		<div>
			<div className="heading">
				Publisher Wise Data<br />
				<ExeclDownload filename={`Complete Report Publisher wise`}>
					<ExcelSheet dataSet={QuartileDown.audio} name="Complete Quartile Publisher Audio Wise" />
					<ExcelSheet dataSet={QuartileDown.video} name="Complete Quartile Publisher Video Wise" />
					<ExcelSheet dataSet={PhonComp.audio} name="Complete Publisher Audio Wise" />
					<ExcelSheet dataSet={PhonComp.display} name="Complete Publisher Display Wise" />
					<ExcelSheet dataSet={PhonComp.video} name="Complete Publisher Video Wise" />
				</ExeclDownload>
			</div>
			<PublisherConsoleTable
				title="Audio"
				headers={headers}
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
