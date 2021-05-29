import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { orderSetter } from '../redux/actions/manageadsAction';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function QuartilePublisher({ title, report, state1, ids, arrowRetuner }) {
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ sa, setsa ] = React.useState('impressions');
	const [ order, setorder ] = React.useState('desc');
	const [ adss, setadss ] = React.useState(report);
	useEffect(
		() => {
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return b.impressions - a.impressions;
				});
				setadss(data);
			} else {
				setadss(report);
			}
		},
		[ report ]
	);
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
	// console.log(adss && adss.length ? 'data' : 'no data')
	return (
		<Paper>
			<TableContainer style={{ margin: '20px 0' }}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
				{state1 && adss.length && ids ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell
									onClick={() => tablesorter('publishername', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Publisher
									{arrowRetuner(sa === 'publishername' ? (order === 'asc' ? '1' : '2') : '3')}
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
								<TableCell
									onClick={() => tablesorter('impressions', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impresions{' '}
									{arrowRetuner(sa === 'impressions' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => {
								return (
									<TableRow key={i}>
										<TableCell>{log.publishername}</TableCell>
										<TableCell>{log.firstQuartile}</TableCell>
										<TableCell>{log.midpoint}</TableCell>
										<TableCell>{log.thirdQuartile}</TableCell>
										<TableCell>{log.complete}</TableCell>
										<TableCell>{log.impressions}</TableCell>
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

export default QuartilePublisher;
