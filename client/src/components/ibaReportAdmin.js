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

function IbaReportAdmin({ title, report, state1, arrowRetuner }) {
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ ci, setci ] = React.useState(0);
	const [ cc, setcc ] = React.useState(0);
	const [ adss, setadss ] = React.useState([]);
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
		{ key: 'category', label: 'Category' },
		{ key: 'Name', label: 'Name' },
		{ key: 'tier1', label: 'Tier 1' },
		{ key: 'tier2', label: 'Tier 2' },
		{ key: 'tier3', label: 'Tier 3' },
		{ key: 'tier4', label: 'Tier 4' },
		{ key: 'genderCategory', label: 'Gender Category' },
		{ key: 'AgeCategory', label: 'Age Category' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'clicks', label: 'Clicks' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${state1}_${title}_IBAData.csv`,
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
					row.category = row._id.category ? row._id.category : '';
					row.Name = row.extra_details.length !== 0 ? row.extra_details[0].Name : '';
					row.tier1 = row.extra_details.length !== 0 ? row.extra_details[0].tier1 : '';
					row.tier2 = row.extra_details.length !== 0 ? row.extra_details[0].tier2 : '';
					row.tier3 = row.extra_details.length !== 0 ? row.extra_details[0].tier3 : '';
					row.tier4 = row.extra_details.length !== 0 ? row.extra_details[0].tier4 : '';
					row.genderCategory = row.extra_details.length !== 0 ? row.extra_details[0].genderCategory : '';
					row.AgeCategory = row.extra_details.length !== 0 ? row.extra_details[0].AgeCategory : '';
					row.impression = row.impressions ? row.impressions : 0;
					ai += row.impressions;
					row.clicks = parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking);
					ac += row.clicks;
					row.ctr =
						(parseInt(row.CompanionClickTracking) + parseInt(row.SovClickTracking)) *
						100 /
						(row.impressions ? row.impressions : 0);
				});
				csvReport.data = data;
				console.log('neww', data);
				setci(ai);
				setcc(ac);
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
									onClick={() => tablesorter('category', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Category{arrowRetuner(sa === 'category' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('Name', 'string')} style={{ cursor: 'pointer' }}>
									Name{arrowRetuner(sa === 'Name' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('tier1', 'string')} style={{ cursor: 'pointer' }}>
									Tier 1{arrowRetuner(sa === 'tier1' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('tier2', 'string')} style={{ cursor: 'pointer' }}>
									Tier 2{arrowRetuner(sa === 'tier2' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('tier3', 'string')} style={{ cursor: 'pointer' }}>
									Tier 3{arrowRetuner(sa === 'tier3' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('tier4', 'string')} style={{ cursor: 'pointer' }}>
									Tier 4{arrowRetuner(sa === 'tier4' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('genderCategory', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Gender Category{arrowRetuner(
										sa === 'genderCategory' ? (order === 'asc' ? '1' : '2') : '3'
									)}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('AgeCategory', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Age Category{arrowRetuner(
										sa === 'AgeCategory' ? (order === 'asc' ? '1' : '2') : '3'
									)}
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
										<TableCell>{row.category}</TableCell>
										<TableCell>{row.Name}</TableCell>
										<TableCell>{row.tier1}</TableCell>
										<TableCell>{row.tier2}</TableCell>
										<TableCell>{row.tier3}</TableCell>
										<TableCell>{row.tier4}</TableCell>
										<TableCell>{row.genderCategory}</TableCell>
										<TableCell>{row.AgeCategory}</TableCell>
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
							})}
							<TableRow>
								<TableCell className="boldClass">Total</TableCell>
								<TableCell />
								<TableCell />
								<TableCell />
								<TableCell />
								<TableCell />
								<TableCell />
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

export default IbaReportAdmin;
