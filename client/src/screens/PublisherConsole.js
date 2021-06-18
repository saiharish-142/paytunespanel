import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadPublisherData, PublisherLoading } from '../redux/actions/ConsoledateActions';
import PreLoader from '../components/loaders/PreLoader';
import { CSVLink } from 'react-csv';
import {
	Paper,
	Table,
	TableBody,
	TablePagination,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@material-ui/core';
import { orderSetter } from '../redux/actions/manageadsAction';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';

function PublisherConsole() {
	const dispatchRedux = useDispatch();
	const consoledata = useSelector((state) => state.consoleDateReport);
	useEffect(() => {
		dispatchRedux(PublisherLoading());
		dispatchRedux(LoadPublisherData());
	}, []);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ sa, setsa ] = React.useState('impressions');
	const [ order, setorder ] = React.useState('desc');
	const [ adss, setadss ] = React.useState(consoledata.publisherData);
	const headers = [
		{ key: 'publisherName', label: 'Publisher' },
		{ key: 'ssp', label: 'SSP' },
		{ key: 'impression', label: 'Total Impressions Delivered till date' },
		{ key: 'click', label: 'Total Clicks Delivered till date' },
		{ key: 'ctr', label: 'CTR' },
		{ key: 'feed', label: 'Feed' }
	];
	var csvReport = {
		filename: `PublisherData.csv`,
		headers: headers,
		data: adss
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, adss, type);
		setadss(setData);
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
	useEffect(
		() => {
			if (consoledata.publisherData) {
				setadss(consoledata.publisherData);
			}
		},
		[ consoledata ]
	);
	if (consoledata.publisherDataLoading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	console.log(adss);
	return (
		<div>
			<div className="heading">
				Publisher Wise Data<br />
				{adss && adss.length ? (
					<CSVLink style={{ fontSize: '15px' }} {...csvReport}>
						Download Table
					</CSVLink>
				) : (
					''
				)}
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
								<TableCell onClick={() => tablesorter('feed', 'string')} style={{ cursor: 'pointer' }}>
									Feed {arrowRetuner(sa === 'feed' ? (order === 'asc' ? '1' : '2') : '3')}
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
											<TableCell>{log.impression}</TableCell>
											<TableCell>{log.click}</TableCell>
											<TableCell>{Math.round(log.ctr * 100) / 100}%</TableCell>
											<TableCell>{log.feed}</TableCell>
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

export default PublisherConsole;
