import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
// import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { CSVLink } from 'react-csv';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function Creative_Report({ title, report, state1, impression, clicks }) {
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ totalImpreS, settotalImpreS ] = React.useState(0);
	const [ totalClickS, settotalClickS ] = React.useState(0);
	const [ adss, setadss ] = React.useState(report);
	const headers = [
		{ key: 'creativeset', label: 'Creative Set' },
		{ key: 'status', label: 'Status' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'clicks', label: 'Clicks' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${state1}_${title}_CreativeReportData.csv`,
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
					closk += parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking);
				});
				// console.log(imoop, closk);
				data.map((row) => {
					row.creativeset = row._id.creativeset ? row._id.creativeset : '';
					var impre = Math.trunc(row.impression * impression / imoop);
					console.log(impre);
					row.impression = impre;
					var cliol = Math.trunc(
						parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking) * clicks / closk
					);
					row.clicks = parseInt(cliol);
					imoop1 += impre;
					closk1 += cliol;
					row.ctr = Math.round(parseInt(cliol) * 100 / parseInt(impre) * 100) / 100 + '%';
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
				setadss(data);
				settotalImpreS(imoop1);
				settotalClickS(closk1);
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
				{/* <div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div> */}
				{adss && adss.length > 0 ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Creative Set</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Impressions</TableCell>
								<TableCell>Clicks</TableCell>
								<TableCell>CTR</TableCell>
								<TableCell>
									{/* {adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''} */}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
								return (
									<TableRow key={i}>
										<TableCell component="th" scope="row">
											{row._id.creativeset ? row._id.creativeset : ''}
										</TableCell>
										<TableCell>{row.status}</TableCell>
										<TableCell>{row ? row.impression : ''}</TableCell>
										<TableCell>
											{parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking)}
										</TableCell>
										<TableCell>{row.ctr}</TableCell>
										{/* <TableCell
											className="mangeads__report"
											onClick={() => history.push(`/manageAds/${state1}/detailed`)}
										>
											Detailed Report
										</TableCell> */}
									</TableRow>
								);
							})}
							<TableRow>
								<TableCell className="boldClass">Total</TableCell>
								<TableCell className="boldClass" />
								<TableCell className="boldClass">{totalImpreS}</TableCell>
								<TableCell className="boldClass">{totalClickS}</TableCell>
								<TableCell className="boldClass">
									{Math.round(totalClickS / totalImpreS * 100) / 100}%
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

export default Creative_Report;
