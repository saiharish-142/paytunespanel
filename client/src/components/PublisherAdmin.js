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

function PublisherAdmin({
	title,
	report,
	state1,
	timefinder,
	singlead,
	spentdata,
	spentfinder,
	spentOffline,
	spentOfflined,
	spentOfflinev,
	colorfinder,
	ids,
	arrowRetuner,
	titleData
}) {
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ impreComp, setimpreComp ] = React.useState(0);
	const [ clicksComp, setclicksComp ] = React.useState(0);
	const [ spentComp, setspentComp ] = React.useState(0);
	const [ uniqueComp, setuniqueComp ] = React.useState(0);
	const [ sa, setsa ] = React.useState('impressions');
	const [ order, setorder ] = React.useState('desc');
	const [ adss, setadss ] = React.useState(report);
	const headers = [
		{ key: 'publishername', label: 'Publisher' },
		{ key: 'feed', label: 'Feed' },
		{ key: 'ssp', label: 'SSP' },
		{ key: 'unique', label: 'Unique Users' },
		{ key: 'freq', label: 'Average Frequency' },
		{ key: 'target', label: 'Total Impressions to be delivered' },
		{ key: 'impressions', label: 'Total Impressions Delivered till date' },
		{ key: 'spent', label: 'Total spent' },
		{ key: 'clicks', label: 'Total Clicks Delivered till date' },
		{ key: 'ctr', label: 'CTR' }
	];
	var csvReport = {
		filename: `${titleData}_${title}_PublisherData.csv`,
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
				var imoop = 0,
					cliom = 0,
					spentdd = 0,
					uniqea = 0;
				data.map((x) => (uniqea += x.unique));
				data.map((ad) => {
					var publishbid = ad.PublisherSplit;
					// console.log(publishbid);
					ad.freq = Math.round(ad.impressions / ad.unique * 100) / 100;
					ad.overlap = Math.round(ad.unique * 100 / uniqea * 100) / 100;
					imoop += ad.impressions;
					cliom += ad.clicks;
					spentdd += ad.spent ? parseFloat(ad.spent) : 0;
					ad.spent =
						spentfinder(
							ad.Publisher._id,
							ad.campaignId,
							ad.impressions,
							publishbid,
							publishbid ? 'apppub' : 'appid'
						) +
						parseInt(title === 'Audio' ? (spentOffline ? spentOffline : 0) : 0) +
						parseInt(title === 'Display' ? (spentOfflined ? spentOfflined : 0) : 0) +
						parseInt(title === 'Video' ? (spentOfflinev ? spentOfflinev : 0) : 0);
					// console.log(ad.spent);
					return ad;
				});
				csvReport.data = data;
				setimpreComp(imoop);
				setclicksComp(cliom);
				setuniqueComp(uniqea);
				setspentComp(spentdd);
				setadss(data);
			} else {
				setadss(report);
			}
		},
		[ report, spentdata ]
	);
	const classes = useStyles();
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
	// console.log(adss && adss.length ? 'data' : 'no data')
	return (
		<Paper>
			<TableContainer style={{ margin: '20px 0' }}>
				<div style={{ margin: '5px', fontWeight: 'bolder' }}>{title} Report</div>
				{state1 && adss.length && ids ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell
									onClick={() => tablesorter('publishername', 'string')}
									style={{ cursor: 'pointer' }}
								>
									Publisher
									{arrowRetuner(sa === 'publishername' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('ssp', 'string')} style={{ cursor: 'pointer' }}>
									SSP {arrowRetuner(sa === 'ssp' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('feed', 'string')} style={{ cursor: 'pointer' }}>
									Feed {arrowRetuner(sa === 'feed' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('target', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impressions to be delivered{' '}
									{arrowRetuner(sa === 'target' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('impressions', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Impressions Delivered till date{' '}
									{arrowRetuner(sa === 'impressions' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('unique', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Unique Users {arrowRetuner(sa === 'unique' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('freq', 'number')} style={{ cursor: 'pointer' }}>
									Average Frequency{' '}
									{arrowRetuner(sa === 'freq' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell
									onClick={() => tablesorter('clicks', 'number')}
									style={{ cursor: 'pointer' }}
								>
									Total Clicks Delivered till date{' '}
									{arrowRetuner(sa === 'clicks' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('ctr', 'number')} style={{ cursor: 'pointer' }}>
									CTR {arrowRetuner(sa === 'ctr' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell onClick={() => tablesorter('spent', 'number')} style={{ cursor: 'pointer' }}>
									Total spent {arrowRetuner(sa === 'spent' ? (order === 'asc' ? '1' : '2') : '3')}
								</TableCell>
								<TableCell>
									{adss && adss.length ? <CSVLink {...csvReport}>Download Table</CSVLink> : ''}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => {
								return (
									<TableRow
										key={i}
										style={{
											background: colorfinder(
												timefinder(singlead.endDate, singlead.startDate),
												timefinder(Date.now(), singlead.startDate),
												parseInt(log.target),
												log.impressions
											)
										}}
									>
										<TableCell>{log.publishername}</TableCell>
										<TableCell>{log.ssp}</TableCell>
										<TableCell>
											{log.feed === '3' ? (
												'Podcast'
											) : log.feed === '' ? (
												'Ondemand and Streaming'
											) : (
												''
											)}
										</TableCell>
										<TableCell>{parseInt(log.target)}</TableCell>
										<TableCell>{log.impressions}</TableCell>
										<TableCell>{log.unique}</TableCell>
										<TableCell>{log.freq}</TableCell>
										<TableCell>{log.clicks}</TableCell>
										<TableCell>{Math.round(log.ctr * 100) / 100}%</TableCell>
										<TableCell>{Math.round(log.spent * 1) / 1}</TableCell>
										<TableCell
											className="mangeads__report"
											onClick={() =>
												history.push(
													`/manageAds/${state1}/detailedoverallpublisherreport/${log.publishername}`
												)}
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
								<TableCell className="boldClass">{impreComp}</TableCell>
								<TableCell className="boldClass">{uniqueComp}</TableCell>
								<TableCell className="boldClass">
									{Math.round(impreComp / uniqueComp * 100) / 100}
								</TableCell>
								<TableCell className="boldClass">{clicksComp}</TableCell>
								<TableCell className="boldClass">
									{Math.round(clicksComp * 100 / impreComp * 100) / 100}%
								</TableCell>
								{/* <TableCell className="boldClass">{spentComp}</TableCell> */}
								<TableCell />
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

export default PublisherAdmin;
