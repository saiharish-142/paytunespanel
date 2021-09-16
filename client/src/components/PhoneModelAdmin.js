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

function PhoneModelAdmin({ title, report, state1, arrowRetuner }) {
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ compi, setcompi ] = React.useState(0);
	const [ compc, setcompc ] = React.useState(0);
	const [ adss, setadss ] = React.useState(report);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('desc');
	const headers = [
		{ key: 'phoneModel', label: 'Phone Model' },
		{ key: 'release', label: 'Release Month And Year' },
		{ key: 'cost', label: 'Release Cost or MRP' },
		{ key: 'company', label: 'Company Name' },
		{ key: 'model', label: 'Model' },
		{ key: 'type', label: 'Type of Device' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'clicks', label: 'Clicks' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${state1}_${title}_PhoneModelData.csv`,
		headers: headers,
		data: adss
	};
	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, adss, type);
		setadss(setData);
	};
	useEffect(
		() => {
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return b.impression - a.impression;
				});
				var ai = 0,
					ac = 0;
				data.map((a) => {
					a.phoneModel = a.phoneModel ? a.phoneModel : null;
					a.release = a.extra ? a.extra.release : null;
					a.cost = a.extra ? a.extra.cost : null;
					a.company = a.extra ? a.extra.company : null;
					a.model = a.extra ? a.extra.model : null;
					a.type = a.extra ? a.extra.type : null;
					a.impression = a ? a.impression : null;
					ai += a.impression ? parseInt(a.impression) : 0;
					a.clicks = parseInt(a.CompanionClickTracking) + parseInt(a.SovClickTracking);
					ac += a.clicks ? parseInt(a.clicks) : 0;
					a.ctr = a.impression
						? (parseInt(a.CompanionClickTracking) + parseInt(a.SovClickTracking)) * 100 / a.impression
						: 0;
				});
				setcompi(ai);
				setcompc(ac);
				csvReport.data = data;
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
	// console.log(adss && adss.length ? 'data' : 'no data')
	return (
		<Paper>
			<TableContainer style={{ margin: '20px 0' }}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
				{adss && adss.length > 0 ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell
									onClick={() => tablesorter('phoneModel', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Phone Model{arrowRetuner(sa === 'phoneModel' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('release', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Release Month And Year{arrowRetuner(
										sa === 'release' ? (order === 'asc' ? '1' : '2') : '3'
									)}
								</TableCell>
								<TableCell onClick={() => tablesorter('cost', 'string')} style={{ cursor: 'pointer' }}>
									Release Cost or MRP{arrowRetuner(
										sa === 'cost' ? (order === 'asc' ? '1' : '2') : '3'
									)}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('company', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Company Name{arrowRetuner(sa === 'company' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('model', 'string')} style={{ cursor: 'pointer' }}>
									Model{arrowRetuner(sa === 'model' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('type', 'string')} style={{ cursor: 'pointer' }}>
									Type of Device{arrowRetuner(sa === 'type' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impression', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Impressions{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('clicks', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Clicks{arrowRetuner(sa === 'clicks' ? (order === 'asc' ? '1' : '2') : '3')}
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
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
								return (
									<TableRow key={i}>
										<TableCell>{row.phoneModel}</TableCell>
										<TableCell>{row.release}</TableCell>
										<TableCell>{row.cost}</TableCell>
										<TableCell>{row.company}</TableCell>
										<TableCell>{row.model}</TableCell>
										<TableCell>{row.type}</TableCell>
										<TableCell>{row.impression}</TableCell>
										<TableCell>{row.clicks}</TableCell>
										<TableCell>{Math.round(row.ctr * 100) / 100 + '%'}</TableCell>
										<TableCell
											className="mangeads__report"
											onClick={() => history.push(`/manageAds/${state1}/detailed`)}
										>
											Detailed Report
										</TableCell>
									</TableRow>
								);
							})}
							<TableRow>
								<TableCell className="boldClass">Total</TableCell>
								<TableCell />
								<TableCell />
								<TableCell />
								<TableCell />
								<TableCell />
								<TableCell className="boldClass">{compi}</TableCell>
								<TableCell className="boldClass">{compc}</TableCell>
								<TableCell />
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

export default PhoneModelAdmin;
