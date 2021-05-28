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

function SortPaTable(props) {
	const history = useHistory();
	const dispatchRedux = useDispatch();
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
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
									return (
										<TableCell
											key={ad.id}
											sortDirection={'asc'}
											onClick={() => {
												var direction =
													props.order === ad.id
														? props.direc === 'asc' ? 'desc' : 'asc'
														: 'asc';
												// console.log(direction, ad.id);
												dispatchRedux(props.orderManager(direction, ad.id, ad.type));
											}}
										>
											<TableSortLabel active={props.order === ad.id} direction={props.direc}>
												{ad.lable}
											</TableSortLabel>
										</TableCell>
									);
								})}
								{props.tabletype !== 'campagins' && !props.clientview && <TableCell />}
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{props.adss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
								return (
									<TableRow key={row._id}>
										{props.tabletype === 'campagins' ? (
											<TableCell>{row.Adtitle}</TableCell>
										) : (
											<TableCell>{row.bundleadtitle}</TableCell>
										)}
										<TableCell>{row.Advertiser}</TableCell>
										<TableCell>{row.Pricing}</TableCell>
										<TableCell>{row.ro}</TableCell>
										<TableCell>{row.PricingModel}</TableCell>
										<TableCell>{row.Category}</TableCell>
										<TableCell>{dateformatchanger(row.createdOn.substring(0, 10))}</TableCell>
										<TableCell>{dateformatchanger(row.startDate.substring(0, 10))}</TableCell>
										<TableCell>{dateformatchanger(row.endDate.substring(0, 10))}</TableCell>
										<TableCell>
											{typeof row.remainingDays === 'number' ? (
												Math.round(row.remainingDays * 1) / 1
											) : (
												row.remainingDays
											)}
										</TableCell>
										{props.tabletype !== 'campagins' &&
										!props.clientview && (
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
