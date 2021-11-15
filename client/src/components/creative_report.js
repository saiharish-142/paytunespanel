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

function Creative_Report({ title, report, state1 }) {
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ ci, setci ] = React.useState(0);
	const [ cc, setcc ] = React.useState(0);
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
					return b.impressions - a.impressions;
				});
				var ai = 0,
					ac = 0;
				data.map((row) => {
					row.creativeset = row._id.creativeset ? row._id.creativeset : '';
					row.impression = row ? row.impression : 0;
					ai += row.impression;
					row.clicks = parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking);
					ac += row.clicks;
					row.ctr =
						Math.round(
							(parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking)) *
								100 /
								parseInt(row.impression) *
								100
						) /
							100 +
						'%';
				});
				setadss(data);
				setci(ai);
				setcc(ac);
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
									{adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''}
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
										<TableCell />
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
								<TableCell />
								<TableCell className="boldClass">{ci}</TableCell>
								<TableCell className="boldClass">{cc}</TableCell>
								<TableCell className="boldClass">{Math.round(cc * 100 / ci * 100) / 100}%</TableCell>
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

export default Creative_Report;
