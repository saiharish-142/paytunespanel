import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router-dom';
// import regiondata from './Regionfinder';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';

function LanguagePro({ ids, url, adtype, state1, arrowRetuner }) {
	// console.log(click,ratio)
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ adss, setadss ] = React.useState([]);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('desc');
	const headers = [
		{ key: 'citylanguage', label: 'Language' },
		{ key: 'impression', label: 'Total Impressions Delivered till date' },
		{ key: 'clicks', label: 'Total Clicks Delivered till date' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${state1}_${adtype}_PublisherData.csv`,
		headers: headers,
		data: adss
	};
	useEffect(
		() => {
			// console.log(ids,url,adtype)
			if (ids) {
				fetch(`/subrepo/${url}`, {
					method: 'put',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + localStorage.getItem('jwt')
					},
					body: JSON.stringify({
						campaignId: ids
					})
				})
					.then((res) => res.json())
					.then((result) => {
						// console.log(result,url)
						var loco = result;
						loco = loco.sort(function(a, b) {
							return b.impression - a.impression;
						});
						loco.map((a) => {
							a.impression = a.impression ? parseInt(a.impression) : 0;
							a.clicks = a.CompanionClickTracking
								? a.CompanionClickTracking
								: 0 + a.SovClickTracking ? a.SovClickTracking : 0;
							a.ctr =
								parseInt(
									a.CompanionClickTracking
										? a.CompanionClickTracking
										: 0 + a.SovClickTracking ? a.SovClickTracking : 0
								) / parseInt(a.impression ? parseInt(a.impression) : 0);
						});
						csvReport.data = loco;
						setadss(loco);
					})
					.catch((err) => console.log(err));
			}
		},
		[ ids ]
	);
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
		<Paper>
			<div style={{ margin: '5px', fontWeight: 'bolder' }}>{adtype} Type</div>
			<TableContainer>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell
								onClick={() => tablesorter('citylanguage', 'string')}
								style={{ cursor: 'pointer' }}
							>
								Language{arrowRetuner(sa === 'citylanguage' ? (order === 'asc' ? '1' : '2') : '3')}
							</TableCell>
							<TableCell
								onClick={() => tablesorter('impression', 'number')}
								style={{ cursor: 'pointer' }}
							>
								Total Impressions Delivered till date{arrowRetuner(
									sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3'
								)}
							</TableCell>
							<TableCell onClick={() => tablesorter('clicks', 'number')} style={{ cursor: 'pointer' }}>
								Total Clicks Delivered till date{arrowRetuner(
									sa === 'clicks' ? (order === 'asc' ? '1' : '2') : '3'
								)}
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
									if (
										row.citylanguage &&
										row.citylanguage !== ' - ' &&
										row.citylanguage &&
										row.citylanguage !== undefined
									) {
										// console.log(row.citylanguage && row.citylanguage[0].toUpperCase() + row.citylanguage.substring(1,))
										// console.log(row.citylanguage && row.citylanguage[0])
										return (
											<TableRow key={i} hover role="checkbox" tabIndex={-1} key={row._id}>
												<TableCell>{row.citylanguage}</TableCell>
												<TableCell>{row.impression}</TableCell>
												<TableCell>{row.clicks}</TableCell>
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

export default LanguagePro;
