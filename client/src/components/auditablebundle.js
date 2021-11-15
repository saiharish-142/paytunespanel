import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router-dom';
import regiondata from './Regionfinder';

function AuditableBundle({
	streamingads,
	title,
	jsotitle,
	ids,
	url,
	regtitle,
	adtype,
	state1,
	client,
	ratio,
	impression,
	click
}) {
	// console.log(click,ratio)
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ totalimpre, settotalimpre ] = React.useState(0);
	const [ totalclick, settotalclick ] = React.useState(0);
	const [ adss, setadss ] = React.useState([]);
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
						var totimpre = 0;
						var totclick = 0;
						loco.map((a) => {
							totimpre += a.impression ? parseInt(a.impression) : 0;
							totclick += a.CompanionClickTracking
								? a.CompanionClickTracking
								: 0 + a.SovClickTracking ? a.SovClickTracking : 0;
						});
						// console.log(typeof impression, impression)
						// console.log(totimpre,totclick)
						settotalimpre(totimpre);
						settotalclick(totclick);
						// console.log(loco,url)
						setadss(loco);
					})
					.catch((err) => console.log(err));
			}
		},
		[ ids ]
	);
	// console.log(impression,url,adtype)
	// useEffect(()=>{
	//     console.log(impression,totalimpre,url,impression/totalimpre,adtype)
	// },[totalimpre,impression])
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	return (
		<Paper>
			<div style={{ margin: '5px', fontWeight: 'bolder' }}>{adtype} Type</div>
			<TableContainer>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>{title}</TableCell>
							<TableCell>Total Impressions Delivered till date</TableCell>
							{/* {(jsotitle==='region' || jsotitle==='zip' || jsotitle==='language') && <TableCell>Unique Users</TableCell>} */}
							<TableCell>Total Clicks Delivered till date</TableCell>
							<TableCell>CTR</TableCell>
							{!client && <TableCell />}
						</TableRow>
					</TableHead>
					<TableBody>
						{adss && adss.length >= 1 ? (
							adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
								if (typeof row !== 'undefined') {
									if (
										row[jsotitle] &&
										row[jsotitle] !== ' - ' &&
										row[jsotitle] &&
										row[jsotitle] !== undefined
									) {
										return (
											<TableRow key={i} hover role="checkbox" tabIndex={-1} key={row._id}>
												{jsotitle === 'region' ? (
													<TableCell>
														{regiondata[row[jsotitle]] ? (
															regiondata[row[jsotitle]]
														) : (
															row[jsotitle]
														)}
													</TableCell>
												) : jsotitle === 'zip' ? (
													<TableCell>{row[jsotitle]}</TableCell>
												) : (
													<TableCell>
														{row[jsotitle] &&
															row[jsotitle][0] !== undefined &&
															row[jsotitle][0].toUpperCase() + row[jsotitle].substring(1)}
													</TableCell>
												)}
												{client ? (
													<TableCell>
														{Math.round(impression * row.impression / totalimpre)}
													</TableCell>
												) : (
													<TableCell>{row.impression}</TableCell>
												)}
												<TableCell>
													{click ? (
														Math.round(
															click *
																(row.CompanionClickTracking
																	? parseInt(row.CompanionClickTracking)
																	: 0 + row.SovClickTracking
																		? parseInt(row.SovClickTracking)
																		: 0) /
																totalclick
														)
													) : (
														Math.round(
															row.CompanionClickTracking
																? parseInt(row.CompanionClickTracking)
																: 0 + row.SovClickTracking
																	? parseInt(row.SovClickTracking)
																	: 0
														)
													)}
												</TableCell>
												<TableCell>
													{impression ? (
														Math.round(
															(row.CompanionClickTracking
																? parseInt(row.CompanionClickTracking)
																: 0 + row.SovClickTracking
																	? parseInt(row.SovClickTracking)
																	: 0) *
																click /
																totalclick *
																100 /
																(impression * parseInt(row.impression) / totalimpre) *
																100
														) / 100
													) : (
														Math.round(
															(row.CompanionClickTracking
																? parseInt(row.CompanionClickTracking)
																: 0 + row.SovClickTracking
																	? parseInt(row.SovClickTracking)
																	: 0) *
																100 /
																parseInt(row.impression) *
																100
														) / 100
													)}%
												</TableCell>
												{!client && (
													<TableCell
														className="mangeads__report"
														onClick={() => history.push(`/manageAds/${state1}/detailed`)}
													>
														Detailed Report
													</TableCell>
												)}
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

export default AuditableBundle;
