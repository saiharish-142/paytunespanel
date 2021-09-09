import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';
import { useDispatch } from 'react-redux';
import SearchCampagin from './SearchCampagin';
import { LTRLoad } from '../redux/actions/SeperateActions';

function PublisherConsoleTable({
	title,
	consoledata,
	arrowRetuner,
	searchPublisherData,
	orderManagerPublisherData,
	headers,
	storepaginationPublisherData
}) {
	const dispatchRedux = useDispatch();
	const [ searchval, setSearchval ] = useState(consoledata.publisherDataValue);
	const onChangeRedux = (val) => {
		dispatchRedux(searchPublisherData(val));
		setSearchval(val);
	};
	const [ rowsPerPage, setRowsPerPage ] = useState(consoledata.publisherDataRPP);
	const [ page, setPage ] = useState(consoledata.publisherDataPagination);
	const [ sa, setsa ] = useState(consoledata.publisherDataordername);
	const [ order, setorder ] = useState(consoledata.publisherDataorderdir);
	const [ adss, setadss ] = useState(consoledata.searchedpublisherData);
	var csvReport = {
		filename: `${title}_CompletePublisherData.csv`,
		headers: headers,
		data: adss
	};
	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, adss, type);
		dispatchRedux(LTRLoad());
		dispatchRedux(orderManagerPublisherData(orde, column));
		setadss(setData);
	};
	const handleChangePage = (event, newPage) => {
		dispatchRedux(storepaginationPublisherData(newPage, rowsPerPage));
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		dispatchRedux(storepaginationPublisherData(page, +event.target.value));
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	useEffect(
		() => {
			if (consoledata.searchedpublisherData) {
				var data = consoledata.searchedpublisherData;
				data.map((x) => {
					var uniquef = x.impression / x.unique;
					x.uniquef = uniquef ? Math.round(uniquef * 100) / 100 : 0;
				});
				setadss(consoledata.searchedpublisherData);
				// tablesorter('impression', 'number');
			}
		},
		[ consoledata ]
	);
	// console.log(adss && adss.length ? 'data' : 'no data')
	// useEffect(
	// 	() => {
	// 		var data = adss;
	// 		data &&
	// 			data.map((x) => {
	// 				x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
	// 			});
	// 		setadss(data);
	// 	},
	// 	[ adss ]
	// );
	return (
		<div>
			<div style={{ margin: '5px', fontWeight: 'bolder' }}>
				{title} Report {adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''}
			</div>
			<div className="tableCont">
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
								<TableCell onClick={() => tablesorter('fede', 'string')} style={{ cursor: 'pointer' }}>
									Feed {arrowRetuner(sa === 'fede' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impression', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impressions Delivered till date{' '}
									{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('unique', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Unique Users {arrowRetuner(sa === 'unique' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('uniquef', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Average Frequency
									{arrowRetuner(sa === 'uniquef' ? (order === 'asc' ? '1' : '2') : '3')}
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
											<TableCell>{log.fede}</TableCell>
											<TableCell>{log.impression}</TableCell>
											<TableCell>{log.unique}</TableCell>
											<TableCell>{log.uniquef}</TableCell>
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
			</Paper>
		</div>
	);
}

export default PublisherConsoleTable;
