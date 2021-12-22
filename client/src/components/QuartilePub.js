import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
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

function QuartilePublisher({ title, report, state1, ids, arrowRetuner }) {
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ comp1, setcomp1 ] = React.useState(0);
	const [ comp2, setcomp2 ] = React.useState(0);
	const [ comp3, setcomp3 ] = React.useState(0);
	const [ comp4, setcomp4 ] = React.useState(0);
	const [ compi, setcompi ] = React.useState(0);
	const [ compc, setcompc ] = React.useState(0);
	const [ sa, setsa ] = React.useState('impressions');
	const [ order, setorder ] = React.useState('desc');
	const [ adss, setadss ] = React.useState(report);
	const headers = [
		{ key: 'publishername', label: 'Publisher' },
		{ key: 'publisherid', label: 'PublisherId' },
		{ key: 'ssp', label: 'ssp' },
		{ key: 'impressions', label: 'Total Impressions' },
		{ key: 'start', label: 'Start' },
		{ key: 'firstQuartile', label: 'First Quartile' },
		{ key: 'midpoint', label: 'Second Quartile' },
		{ key: 'thirdQuartile', label: 'Third Quartile' },
		{ key: 'complete', label: 'Complete' },
		{ key: 'ltr', label: 'LTR' }
	];
	var csvReport = {
		filename: `${state1}_${title}_QuartileData.csv`,
		headers: headers,
		data: adss
	};
	useEffect(
		() => {
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return b.impressions - a.impressions;
				});
				var a1 = 0,
					a2 = 0,
					a3 = 0,
					a4 = 0,
					ai = 0,
					ac = 0;
				data.map((x) => {
					a1 += x.start;
					a2 += x.firstQuartile;
					a3 += x.midpoint;
					a4 += x.thirdQuartile;
					ai += x.impressions;
					ac += x.complete;
				});
				setcomp1(a1);
				setcomp2(a2);
				setcomp3(a3);
				setcomp4(a4);
				setcompi(ai);
				setcompc(ac);
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
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>
					{title} Report {adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''}
				</div>
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
									onClick={() => tablesorter('publisherid', 'string')}
									style={{ cursor: 'pointer' }}
								>
									PublisherId
									{arrowRetuner(sa === 'publisherid' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('ssp', 'string')} style={{ cursor: 'pointer' }}>
									SSP
									{arrowRetuner(sa === 'ssp' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impressions', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impresions{' '}
									{arrowRetuner(sa === 'impressions' ? (order === 'asc' ? '1' : '2') : '3')}
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
								<TableCell onClick={() => tablesorter('ltr', 'number')} style={{ cursor: 'pointer' }}>
									LTR {arrowRetuner(sa === 'ltr' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => {
								return (
									<TableRow key={i}>
										<TableCell>{log.publishername}</TableCell>
										<TableCell>{log.publisherid}</TableCell>
										<TableCell>{log.ssp}</TableCell>
										<TableCell>{log.impressions}</TableCell>
										<TableCell>{log.start}</TableCell>
										<TableCell>{log.firstQuartile}</TableCell>
										<TableCell>{log.midpoint}</TableCell>
										<TableCell>{log.thirdQuartile}</TableCell>
										<TableCell>{log.complete}</TableCell>
										<TableCell>{Math.round(log.ltr * 100) / 100}%</TableCell>
									</TableRow>
								);
							})}
							<TableRow>
								<TableCell className="boldClass">Total</TableCell>
								<TableCell className="boldClass" />
								<TableCell className="boldClass" />
								<TableCell className="boldClass">{compi}</TableCell>
								<TableCell className="boldClass">{comp1}</TableCell>
								<TableCell className="boldClass">{comp2}</TableCell>
								<TableCell className="boldClass">{comp3}</TableCell>
								<TableCell className="boldClass">{comp4}</TableCell>
								<TableCell className="boldClass">{compc}</TableCell>
								<TableCell className="boldClass">
									{Math.round(compc * 100 / compi * 100) / 100}%
								</TableCell>
							</TableRow>
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
