import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel
} from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import EditIcon from '@material-ui/icons/Edit';
import { CSVLink } from 'react-csv';

function SortPaTable(props) {
	const history = useHistory();
	const dispatchRedux = useDispatch();
	const [ page, setPage ] = React.useState(props.pagination);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(props.rpp);
	const handleChangePage = (event, newPage) => {
		dispatchRedux(props.actionToSet(newPage, rowsPerPage));
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		dispatchRedux(props.actionToSet(page, +event.target.value));
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const dateformatchanger = (date) => {
		var dategot = date.toString();
		var datechanged = dategot.slice(8, 10) + '-' + dategot.slice(5, 7) + '-' + dategot.slice(0, 4);
		return datechanged;
	};
	return (
		<div>
			<Paper>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								{props.headers.map((ad) => {
									if (props.clientdirect && ad.key === 'createdOn') {
										return null;
									}
									return (
										<TableCell
											key={ad.key}
											sortDirection={'asc'}
											onClick={() => {
												var direction =
													props.order === ad.key
														? props.direc === 'asc' ? 'desc' : 'asc'
														: 'asc';
												// console.log(direction, ad.key);
												dispatchRedux(props.orderManager(direction, ad.key, ad.type));
											}}
										>
											<TableSortLabel active={props.order === ad.key} direction={props.direc}>
												{ad.label}
											</TableSortLabel>
										</TableCell>
									);
								})}
								{props.tabletype !== 'campagins' &&
								!props.clientview &&
								!props.clientdirect && <TableCell />}
								<TableCell>
									<CSVLink {...props.csvReport}>Download Data</CSVLink>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{props.adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
								return (
									<TableRow key={row._id}>
										{!props.clientdirect ? props.tabletype === 'campagins' ? (
											<TableCell>{row.Adtitle}</TableCell>
										) : (
											<TableCell>{row.bundleadtitle}</TableCell>
										) : (
											<TableCell>{row.campaignName}</TableCell>
										)}
										<TableCell>{row.PricingModel}</TableCell>
										{!props.clientdirect && (
											<TableCell>{dateformatchanger(row.createdOn.substring(0, 10))}</TableCell>
										)}
										<TableCell>{dateformatchanger(row.startDate.substring(0, 10))}</TableCell>
										<TableCell>{dateformatchanger(row.endDate.substring(0, 10))}</TableCell>
										<TableCell>
											{typeof row.remainingDays === 'number' ? (
												Math.ceil(row.remainingDays * 1)
											) : (
												row.remainingDays
											)}
										</TableCell>
										{props.tabletype !== 'campagins' &&
										!props.clientview &&
										!props.clientdirect && (
											<TableCell
												align="center"
												className="mangeads__report"
												onClick={() => history.push(`/bundleManage/${row._id}/edit`)}
											>
												<EditIcon />
											</TableCell>
										)}
										<TableCell
											className="mangeads__report"
											onClick={() => {
												if (props.tabletype === 'campagins') {
													if (props.clientview) {
														history.push(`/clientSideCamp/${row._id}`);
													} else {
														history.push(`/manageAds/${row._id}`);
													}
												} else {
													if (props.clientview) {
														history.push(`/clientSideCamp/${row._id}`);
													} else {
														history.push(`/manageBundles/${row._id}`);
													}
												}
											}}
										>
											Report
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[ 5, 10, 25, 100 ]}
					component="div"
					count={props.adss.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}

export default SortPaTable;
