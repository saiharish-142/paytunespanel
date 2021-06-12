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

function PincodeAdmin({ title, report, state1, arrowRetuner }) {
	const history = useHistory();
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
		{ key: 'zip', label: 'Pincode' },
		{ key: 'area', label: 'Urban/Rural' },
		{ key: 'lowersubcity', label: 'Lower Sub City' },
		{ key: 'subcity', label: 'Subsubcity' },
		{ key: 'city', label: 'City' },
		{ key: 'grandcity', label: 'Grand City' },
		{ key: 'district', label: 'District' },
		{ key: 'comparison', label: 'Comparison' },
		{ key: 'state', label: 'State' },
		{ key: 'grandstate', label: 'Grand State' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'clicks', label: 'Clicks' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${state1}_${title}_PincodeData.csv`,
		headers: headers,
		data: adss
	};
	useEffect(
		() => {
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return b.impression - a.impression;
				});
				data.map((row) => {
					row.clicks = parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking);
					row.ctr =
						(parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking)) *
						100 /
						parseInt(row.impression);
				});
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
								<TableCell onClick={() => tablesorter('zip', 'number')} style={{ cursor: 'pointer' }}>
									Pincode{arrowRetuner(sa === 'zip' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('area', 'string')} style={{ cursor: 'pointer' }}>
									Urban/Rural{arrowRetuner(sa === 'area' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('lowersubcity', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Lower Sub City{arrowRetuner(
										sa === 'lowersubcity' ? (order === 'asc' ? '1' : '2') : '3'
									)}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('subcity', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Subsubcity{arrowRetuner(sa === 'subcity' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('city', 'string')} style={{ cursor: 'pointer' }}>
									City{arrowRetuner(sa === 'city' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('grandcity', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Grand City{arrowRetuner(sa === 'grandcity' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('district', 'string')}
									style={{ cursor: 'pointer' }}
								>
									District{arrowRetuner(sa === 'district' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('comparison', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Comparison{arrowRetuner(sa === 'comparison' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('state', 'string')} style={{ cursor: 'pointer' }}>
									State{arrowRetuner(sa === 'state' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('grandstate', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Grand State{arrowRetuner(sa === 'grandstate' ? (order === 'asc' ? '1' : '2') : '3')}
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
										<TableCell component="th" scope="row">
											{row.zip ? row.zip : ''}
										</TableCell>
										<TableCell>{row.area ? row.area : ''}</TableCell>
										<TableCell>{row.lowersubcity ? row.lowersubcity : ''}</TableCell>
										<TableCell>{row.subcity ? row.subcity : ''}</TableCell>
										<TableCell>{row.city ? row.city : ''}</TableCell>
										<TableCell>{row.grandcity ? row.grandcity : ''}</TableCell>
										<TableCell>{row.district ? row.district : ''}</TableCell>
										<TableCell>{row.comparison ? row.comparison : ''}</TableCell>
										<TableCell>{row.state ? row.state : ''}</TableCell>
										<TableCell>{row.grandstate ? row.grandstate : ''}</TableCell>
										<TableCell>{row.impression ? row.impression : ''}</TableCell>
										<TableCell>{row.clicks}</TableCell>
										<TableCell>{Math.round(row.ctr * 1000 / 1000)}%</TableCell>
										<TableCell
											className="mangeads__report"
											onClick={() => history.push(`/manageAds/${state1}/detailed`)}
										>
											Detailed Report
										</TableCell>
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

export default PincodeAdmin;
