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

function PublisherAdmin({
	title,
	report,
	state1,
	timefinder,
	singlead,
	spentfinder,
	spentOffline,
	spentOfflined,
	spentOfflinev,
	colorfinder,
	ids,
	tablesorter,
	arrowRetuner
}) {
	const history = useHistory();
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ sa, setsa ] = React.useState('impre');
	const [ adss, setadss ] = React.useState(report);
	useEffect(
		() => {
			if (report && report.length > 0) {
				var data = report;
				data.sort(function(a, b) {
					return b.impressions - a.impressions;
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
				{singlead._id && adss.length && ids ? (
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell
									onClick={() =>
										tablesorter(
											'pub',
											1,
											'text',
											'apppubidpo',
											'publishername',
											true,
											setsa,
											setadss,
											adss
										)}
									onDoubleClick={() =>
										tablesorter(
											'revpub',
											-1,
											'text',
											'apppubidpo',
											'publishername',
											true,
											setsa,
											setadss,
											adss
										)}
								>
									Publisher {arrowRetuner(sa === 'pub' ? '1' : sa === 'revpub' ? '2' : '3')}
								</TableCell>
								<TableCell>
									Feed {arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell>
									SSP {arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell>
									Total Impressions to be delivered{' '}
									{arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell
									onClick={() =>
										tablesorter(
											'impre',
											1,
											'num',
											'impressions',
											false,
											false,
											setsa,
											setadss,
											adss
										)}
									onDoubleClick={() =>
										tablesorter(
											'revimpre',
											-1,
											'num',
											'impressions',
											false,
											false,
											setsa,
											setadss,
											adss
										)}
								>
									Total Impressions Delivered till date{' '}
									{arrowRetuner(sa === 'impre' ? '1' : sa === 'revimpre' ? '2' : '3')}
								</TableCell>
								<TableCell>
									Avg required {arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell>
									Avg Achieved {arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell>
									Total spent {arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell>
									Total Clicks Delivered till date{' '}
									{arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell>
									CTR {arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								<TableCell>
									Balance Impressions {arrowRetuner(sa === 'cat' ? '1' : sa === 'revcat' ? '2' : '3')}
								</TableCell>
								
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => {
								return (
									<TableRow
										key={i}
										style={{
											background: colorfinder(
												timefinder(singlead.endDate[0], singlead.startDate[0]),
												timefinder(Date.now(), singlead.startDate[0]),
												parseInt(log.campaignId.TargetImpressions),
												log.impressions
											)
										}}
									>
										<TableCell>
											{log.apppubidpo ? log.apppubidpo.length ? log.apppubidpo[0]
												.publishername ? (
												log.apppubidpo[0].publishername
											) : (
												log.Publisher.AppName
											) : (
												log.Publisher.AppName
											) : (
												log.Publisher.AppName
											)}
										</TableCell>
										<TableCell>
											{log.feed||log.feed==""?log.feed:"null"}
										</TableCell>
										<TableCell>
											{log.apppubidpo && log.apppubidpo[0] && log.apppubidpo[0].ssp}
										</TableCell>
										<TableCell>{parseInt(log.campaignId.TargetImpressions)}</TableCell>
										<TableCell>{log.impressions}</TableCell>
										<TableCell>
											{Math.round(
												parseInt(log.campaignId.TargetImpressions) /
													timefinder(singlead.endDate[0], singlead.startDate[0]) *
													10
											) / 10}
										</TableCell>
										<TableCell>
											{Math.round(
												log.impressions / timefinder(Date.now(), singlead.startDate[0]) * 10
											) / 10}
										</TableCell>
										<TableCell>
											{Math.round(
												(spentfinder(log.Publisher._id, log.campaignId._id, log.impressions) +
													parseInt(title === 'audio' ? spentOffline : 0) +
													parseInt(title === 'display' ? spentOfflined : 0) +
													parseInt(title === 'video' ? spentOfflinev : 0)) *
													1
											) / 1}
										</TableCell>
										<TableCell>{log.clicks}</TableCell>
										<TableCell>
											{Math.round(log.clicks * 100 / log.impressions * 100) / 100}%
										</TableCell>
										<TableCell>
											{parseInt(log.campaignId.TargetImpressions) - log.impressions}
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

export default PublisherAdmin;
