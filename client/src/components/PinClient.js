import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';

function PinClient({ report, title, head, impression, clicks }) {
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ totalImpreS, settotalImpreS ] = React.useState(0);
	const [ totalClickS, settotalClickS ] = React.useState(0);
	const [ adss, setadss ] = React.useState(report);
	const [ imrer, setimrer ] = React.useState(0);
	const [ clicker, setclicker ] = React.useState(0);
	const [ adssload, setadssload ] = React.useState(true);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('desc');
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
	const headers = [
		{ key: 'zip', label: 'Pincode' },
		{ key: 'area', label: 'Urban/Rural' },
		{ key: 'city', label: 'City' },
		{ key: 'grandcity', label: 'Grand City' },
		{ key: 'state', label: 'State' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'clicks', label: 'Clicks' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${head}_${title}_PincodeData.csv`,
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
				var imoop = 0;
				var closk = 0;
				var imoop1 = 0;
				var closk1 = 0;
				data.map((row) => {
					imoop += row.impression;
					closk += row.clicks;
				});
				data.map((row) => {
					var impre = Math.trunc(row.impression * impression / imoop);
					row.impression = impre;
					var cliol = Math.trunc(row.clicks * clicks / closk);
					row.clicks = parseInt(cliol);
					imoop1 += impre;
					closk1 += cliol;
					row.ctr = parseInt(cliol) * 100 / parseInt(impre);
				});
				if (imoop1 < impression || closk1 < clicks) {
					data.push({
						impression: impression - imoop1,
						clicks: clicks - closk1,
						ctr: (clicks - closk1) * 100 / (impression - imoop1)
					});
					imoop1 += impression - imoop1;
					closk1 += clicks - closk1;
				}
				csvReport.data = data;
				setadss(data);
				setadssload(false);
				settotalImpreS(imoop1);
				settotalClickS(closk1);
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
	// if (adssload) {
	// 	return <div />;
	// }
	if (adss && adss.length) {
		return (
			<Paper>
				<TableContainer style={{ margin: '20px 0' }}>
					<div style={{ margin: '5px', fontWeight: 'bolder' }}>{head} Report</div>
					{/* {adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''} */}
					{adss && adss.length > 0 ? (
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell
										onClick={() => tablesorter('zip', 'number')}
										style={{ cursor: 'pointer' }}
									>
										Pincode{arrowRetuner(sa === 'zip' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('area', 'string')}
										style={{ cursor: 'pointer' }}
									>
										Urban/Rural{arrowRetuner(sa === 'area' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('city', 'string')}
										style={{ cursor: 'pointer' }}
									>
										City{arrowRetuner(sa === 'city' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('grandcity', 'string')}
										style={{ cursor: 'pointer' }}
									>
										Grand City{arrowRetuner(
											sa === 'grandcity' ? (order === 'asc' ? '1' : '2') : '3'
										)}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('state', 'string')}
										style={{ cursor: 'pointer' }}
									>
										State{arrowRetuner(sa === 'state' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('impression', 'number')}
										style={{ cursor: 'pointer' }}
									>
										Impressions{arrowRetuner(
											sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3'
										)}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('clicks', 'number')}
										style={{ cursor: 'pointer' }}
									>
										Clicks{arrowRetuner(sa === 'clicks' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('ctr', 'number')}
										style={{ cursor: 'pointer' }}
									>
										CTR{arrowRetuner(sa === 'ctr' ? (order === 'asc' ? '1' : '2') : '3')}
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
											<TableCell>{row.city ? row.city : ''}</TableCell>
											<TableCell>{row.grandcity ? row.grandcity : ''}</TableCell>
											<TableCell>{row.state ? row.state : ''}</TableCell>
											<TableCell>{row.impression ? row.impression : ''}</TableCell>
											<TableCell>{row.clicks}</TableCell>
											<TableCell>{Math.round(row.ctr * 100) / 100}%</TableCell>
										</TableRow>
									);
								})}
								<TableRow>
									<TableCell className="boldClass">Total</TableCell>
									<TableCell className="boldClass" />
									<TableCell className="boldClass" />
									<TableCell className="boldClass" />
									<TableCell className="boldClass" />
									<TableCell className="boldClass">{totalImpreS}</TableCell>
									<TableCell className="boldClass">{totalClickS}</TableCell>
									<TableCell className="boldClass">
										{Math.round(totalClickS * 100 / totalImpreS * 100) / 100}%
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
	return <div>No Data found</div>;
}

export default PinClient;
