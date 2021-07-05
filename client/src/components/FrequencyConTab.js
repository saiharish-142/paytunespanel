import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function FrequencyConTab({ report }) {
	const history = useHistory();
	const classes = useStyles();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ adss, setadss ] = React.useState(report);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('desc');
	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, adss, type);
		setadss(setData);
	};
	const headers = [
		{ key: 'frequency', label: 'Frequency' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'users', label: 'Distinct Users' },
		{ key: 'click', label: 'Clicks' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `CompleteFrequencyData.csv`,
		headers: headers,
		data: adss
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
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return parseInt(b.impression) - parseInt(a.impression);
				});
				data.map((ad) => {
					ad.ctr = parseInt(ad.click) * 100 / parseInt(ad.impression);
				});
				csvReport.data = data;
				setadss(data);
				tablesorter('impression', 'number');
				tablesorter('impression', 'number');
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
				{/* <div style={{ margin: '5px', fontWeight: 'bolder' }}>Frequency Report</div> */}
				{adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''}
				{adss && adss.length > 0 ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell
									onClick={() => tablesorter('frequency', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Frequency{arrowRetuner(sa === 'frequency' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impression', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impressions Delivered till date{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('users', 'number')} style={{ cursor: 'pointer' }}>
									Distinct Users{arrowRetuner(sa === 'users' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('click', 'number')} style={{ cursor: 'pointer' }}>
									Total Clicks Delivered till date{arrowRetuner(sa === 'click' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('ctr', 'number')} style={{ cursor: 'pointer' }}>
									CTR{arrowRetuner(sa === 'ctr' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss && adss.length >= 1 ? (
								adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
									if (typeof row !== 'undefined') {
										if (row.frequency && row.frequency !== undefined) {
											return (
												<TableRow key={i} hover role="checkbox" tabIndex={-1} key={row._id}>
													<TableCell>{row.frequency}</TableCell>
													<TableCell>{row.impression}</TableCell>
													<TableCell>{row.users}</TableCell>
													<TableCell>{row.click}</TableCell>
													<TableCell>{Math.round(row.ctr * 100) / 100}%</TableCell>
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

export default FrequencyConTab;
