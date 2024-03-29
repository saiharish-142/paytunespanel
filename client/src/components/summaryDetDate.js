import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function SummaryDetDate({ report, head, impression, clicks, complete }) {
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ totalImpreS, settotalImpreS ] = React.useState(0);
	const [ totalImpreSonl, settotalImpreSonl ] = React.useState(0);
	const [ totalClickS, settotalClickS ] = React.useState(0);
	const [ totalCompS, settotalCompS ] = React.useState(0);
	const [ totalCompS1, settotalCompS1 ] = React.useState(0);
	const [ adss, setadss ] = React.useState(report);
	const [ sa, setsa ] = React.useState('date');
	const [ order, setorder ] = React.useState('desc');
	const arrowRetuner = (mode) => {
		if (mode === '1') {
			return <ArrowUpwardRoundedIcon fontSize="small" />;
		} else if (mode === '2') {
			return <ArrowDownwardRoundedIcon fontSize="small" />;
		} else {
			return <ArrowUpwardRoundedIcon fontSize="small" style={{ color: 'lightgrey' }} />;
		}
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
				var imoop = 0;
				var imoon = 0;
				var closk = 0;
				var clomp = 0;
				var imoop1 = 0;
				var closk1 = 0;
				var clomp1 = 0;
				data = data.filter((x) => x.type != 'unknown');
				data.map((row) => {
					imoop += parseInt(row.impressions);
					imoon += parseInt(row.onlineImpressions);
					row.impressions = parseInt(row.impressions);
					closk += row.clicks;
					clomp += row.complete;
				});
				console.log(imoop, closk, clomp);
				data.map((row) => {
					var impre = Math.round(row.impressions * impression / imoop);
					var banimpre = row.bannerImpressions ? Math.round(row.bannerImpressions * impression / imoop) : 0;
					var cmpu = Math.round(row.complete * complete / clomp);
					var cliol = Math.round(row.clicks * clicks / closk);
					row.ltr2 = row.complete * 100 / row.onlineImpressions;
					row.impressions = impre;
					row.bannerImpressions = banimpre;
					row.complete = cmpu;
					row.clicks = cliol;
					imoop1 += impre;
					closk1 += cliol;
					clomp1 += cmpu;
					row.ctr = cliol * 100 / impre;
					row.ltr = cmpu * 100 / impre;
					return row;
				});
				console.log(data);
				setadss(data);
				settotalImpreS(imoop1);
				settotalImpreSonl(imoon);
				settotalClickS(closk1);
				settotalCompS(clomp1);
				settotalCompS1(clomp);
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
	return (
		<Paper>
			<TableContainer style={{ margin: '20px 0' }}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{head} Report</div>
				{adss && adss.length > 0 ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell onClick={() => tablesorter('date', 'string')} style={{ cursor: 'pointer' }}>
									Date{arrowRetuner(sa === 'date' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impressions', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Impressions{arrowRetuner(
										sa === 'impressions' ? (order === 'asc' ? '1' : '2') : '3'
									)}
								</TableCell>
								{head && head.toLowerCase().indexOf('audio') > -1 ? (
									<TableCell
										onClick={() => tablesorter('bannerImpressions', 'number')}
										style={{ cursor: 'pointer' }}
									>
										Banner{arrowRetuner(
											sa === 'bannerImpressions' ? (order === 'asc' ? '1' : '2') : '3'
										)}
									</TableCell>
								) : (
									''
								)}
								<TableCell
									onClick={() => tablesorter('clicks', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Clicks{arrowRetuner(sa === 'clicks' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('ctr', 'number')} style={{ cursor: 'pointer' }}>
									CTR{arrowRetuner(sa === 'ctr' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('complete', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Complete{arrowRetuner(sa === 'complete' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('ltr', 'number')} style={{ cursor: 'pointer' }}>
									LTR{arrowRetuner(sa === 'ltr' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
								return (
									<TableRow key={i}>
										<TableCell>{row.date}</TableCell>
										<TableCell>{row.impressions}</TableCell>
										{head && head.toLowerCase().indexOf('audio') > -1 ? (
											<TableCell>{row.bannerImpressions}</TableCell>
										) : (
											''
										)}
										<TableCell>{row.clicks}</TableCell>
										<TableCell>{Math.round(row.ctr * 100) / 100 + '%'}</TableCell>
										<TableCell>{row.complete}</TableCell>
										<TableCell>{Math.round(row.ltr2 * 100) / 100 + '%'}</TableCell>
									</TableRow>
								);
							})}
							<TableRow>
								<TableCell className="boldClass">Total</TableCell>
								<TableCell className="boldClass">{totalImpreS}</TableCell>
								<TableCell className="boldClass">{totalClickS}</TableCell>
								<TableCell className="boldClass">
									{Math.round(totalClickS * 100 / totalImpreS * 100) / 100}%
								</TableCell>
								<TableCell className="boldClass">{totalCompS}</TableCell>
								<TableCell className="boldClass">
									{Math.round(totalCompS1 * 100 / totalImpreSonl * 100) / 100}%
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

export default SummaryDetDate;
