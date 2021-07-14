import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
// import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function QuartilePublisherCon({ title, report, arrowRetuner }) {
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('asc');
	const [ adss, setadss ] = React.useState([]);
	const headers = [
		{ key: 'publisherName', label: 'Publisher' },
		{ key: 'impression', label: 'Total Impressions' },
		{ key: 'start', label: 'Start' },
		{ key: 'firstQuartile', label: 'First Quartile' },
		{ key: 'midpoint', label: 'Second Quartile' },
		{ key: 'thirdQuartile', label: 'Third Quartile' },
		{ key: 'complete', label: 'Complete' },
		{ key: 'lt', label: 'LTR' }
	];
	var csvReport = {
		filename: `${title}_QuartileDataConsole.csv`,
		headers: headers,
		data: adss
	};
	useEffect(
		() => {
			console.log('ads;dsda');
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return b.impression - a.impression;
				});
				data.map((x) => {
					x.lt = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
				});
				console.log('complete');
				setadss(data);
			} else {
				setadss(report);
			}
		},
		[ report ]
	);
	// useEffect(
	// 	() => {
	// 		var repo = adss;
	// 		if (repo && repo.length > 0) {
	// 			var data = repo;
	// 			data.sort(function(a, b) {
	// 				return b.impression - a.impression;
	// 			});
	// 			data.map((x) => {
	// 				x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
	// 			});
	// 			console.log('complete');
	// 			setadss(data);
	// 		} else {
	// 			setadss(repo);
	// 		}
	// 	},
	// 	[ adss ]
	// );
	// useEffect(
	// 	() => {
	// 		console.log(adss);
	// 		if (adss && adss.length) {
	// 			tablesorter('impression', 'number');
	// 		}
	// 	},
	// 	[ adss ]
	// );
	const classes = useStyles();
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
	return (
		<Paper className="tableCont">
			<TableContainer style={{ margin: '20px 0' }}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>
					{title} Report {adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''}
				</div>
				{adss && adss.length ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell
									onClick={() => tablesorter('publisherName', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Publisher
									{arrowRetuner(sa === 'publisherName' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impression', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impresions{' '}
									{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('start', 'number')} style={{ cursor: 'pointer' }}>
									Start {arrowRetuner(sa === 'start' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('firstQuartile', 'number')}
									style={{ cursor: 'pointer' }}
								>
									First Quartile{' '}
									{arrowRetuner(sa === 'firstQuartile' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('midpoint', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Second Quartile{' '}
									{arrowRetuner(sa === 'midpoint' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('thirdQuartile', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Third Quartile{' '}
									{arrowRetuner(sa === 'thirdQuartile' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('complete', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Complete {arrowRetuner(sa === 'complete' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('lt', 'number')} style={{ cursor: 'pointer' }}>
									LTR {arrowRetuner(sa === 'lt' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => {
								return (
									<TableRow key={i}>
										<TableCell>{log.publisherName}</TableCell>
										<TableCell>{log.impression}</TableCell>
										<TableCell>{log.start}</TableCell>
										<TableCell>{log.firstQuartile}</TableCell>
										<TableCell>{log.midpoint}</TableCell>
										<TableCell>{log.thirdQuartile}</TableCell>
										<TableCell>{log.complete}</TableCell>
										<TableCell>{Math.round(log.lt * 100) / 100}%</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<div style={{ margin: '10px', fontSize: '20px' }}>Loading or No Data Found</div>
				)}
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
	);
}
export default QuartilePublisherCon;
