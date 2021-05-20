import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function PincodeAdmin({ title, report, state1 }) {
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ adss, setadss ] = React.useState(report);
	useEffect(
		() => {
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return b.impression - a.impression;
				});
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
								<TableCell>Pincode</TableCell>
								<TableCell>Urban/Rural</TableCell>
								<TableCell>Lower Sub City</TableCell>
								<TableCell>Subcity</TableCell>
								<TableCell>City</TableCell>
								<TableCell>Grand City</TableCell>
								<TableCell>District</TableCell>
								<TableCell>Comparison</TableCell>
								<TableCell>State</TableCell>
								<TableCell>Grand State</TableCell>
								<TableCell>Impressions</TableCell>
								<TableCell>Clicks</TableCell>
								<TableCell>CTR</TableCell>
								<TableCell />
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
										<TableCell>
											{parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking)}
										</TableCell>
										<TableCell>
											{Math.round(
												(parseInt(row.CompanionClickTracking) +
													parseInt(row.SovClickTracking)) /
													parseInt(row.impression) *
													100
											) /
												100 +
												'%'}
										</TableCell>
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
