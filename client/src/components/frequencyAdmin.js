import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function FrequencyAdmin({ title, report, state1, arrowRetuner }) {
	const history = useHistory();
	const classes = useStyles();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ adss, setadss ] = React.useState(report);
	const [ sa, setsa ] = React.useState('_id');
	const [ order, setorder ] = React.useState('asc');
	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, adss, type);
		setadss(setData);
	};
	const headers = [
		{ key: '_id', label: 'Frequency' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'click', label: 'Clicks' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${state1}_${title}_FrequencyData.csv`,
		headers: headers,
		data: adss
	};
	useEffect(
		() => {
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return parseInt(a._id) - parseInt(b._id);
				});
				data.map((ad) => {
					ad.ctr = parseInt(ad.click) / parseInt(ad.impression);
				});
				csvReport.data = data;
				setadss(data);
			} else {
				setadss(report);
			}
		},
		[ report ]
	);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	// console.log(adss && adss.length ? 'data' : 'no data')
	return (
		<Paper>
			<TableContainer style={{ margin: '20px 0' }}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
				{adss && adss.length > 0 ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell onClick={() => tablesorter('_id', 'number')} style={{ cursor: 'pointer' }}>
									Frequency{arrowRetuner(sa === '_id' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impression', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impressions Delivered till date{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('click', 'number')} style={{ cursor: 'pointer' }}>
									Total Clicks Delivered till date{arrowRetuner(sa === 'click' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('ctr', 'number')} style={{ cursor: 'pointer' }}>
									CTR{arrowRetuner(sa === 'ctr' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell>
									{adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss && adss.length >= 1 ? (
								adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
									if (typeof row !== 'undefined') {
										if (row._id && row._id !== undefined) {
											return (
												<TableRow key={i} hover role="checkbox" tabIndex={-1} key={row._id}>
													<TableCell>{row._id}</TableCell>
													<TableCell>{row.impression}</TableCell>
													<TableCell>{row.click}</TableCell>
													<TableCell>{Math.round(row.ctr * 100) / 100}%</TableCell>
													<TableCell
														className="mangeads__report"
														onClick={() => history.push(`/manageAds/${state1}/detailed`)}
													>
														Detailed Report
													</TableCell>
												</TableRow>
											);
										}
									} else {
										return (
											<TableRow>
												<TableCell>No aaads to display</TableCell>
											</TableRow>
										);
									}
								})
							) : (
								<TableRow>
									<TableCell>No ads to display</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				) : (
					<div style={{ margin: '10px', fontSize: '20px' }}>Loading or No Data Found</div>
				)}
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 5, 10, 25, 100, 1000, 10000 ]}
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

export default FrequencyAdmin;
