import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Alert } from '@material-ui/lab';
import { CSVLink } from 'react-csv';
import { arrowRetuner } from '../components/CommonFun';
import { orderSetter } from '../redux/actions/manageadsAction';
import ZipAudiodata from './zipaudio';
import ZipVideodata from './zipvideo';
import ZipBannerdata from './zipbanner';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	Modal,
	FormControlLabel,
	FormGroup,
	Checkbox
} from '@material-ui/core';

import Zipdataform from '../components/zipformdata';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		},
		table: {
			// minWidth: '55%',
			width: '98%'
		}
	},
	paper: {
		position: 'absolute',
		width: 500,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: '2% 2% 2% 6%'
	}
}));

export default function Zipdata() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleOpen = (data) => {
		setOpen(true);
		setShow(true);
		settempdata(data);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [ search1, setsearch ] = useState('');
	const [ searchedData, setsearchedData ] = useState([]);
	const [ datatrus, setdatatrus ] = useState([]);
	const [ datafilterstatus, setdatafilterstatus ] = useState({ A: true, B: true });
	const [ error, seterror ] = useState('');
	const [ success, setsuccess ] = useState('');
	const [ rows, setrows ] = useState([]);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('desc');
	const [ rowsPerPage, setRowsPerPage ] = useState(7);
	const [ page, setPage ] = useState(0);
	const [ sortconfig, setsortconfig ] = useState({ key: 'impression', direction: 'descending' });
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const [ show, setShow ] = useState(false);
	const [ tempdata, settempdata ] = useState({});

	// const handleShow = (data) => {
	// 	setShow(true);
	// 	console.log(data);
	// 	settempdata(data);
	// };
	//const [make_model,setmakemodel]=useState("")
	React.useMemo(
		() => {
			let sortedProducts = searchedData ? searchedData : rows;
			if (sortconfig !== null) {
				sortedProducts.sort((a, b) => {
					if (a[sortconfig.key] < b[sortconfig.key]) {
						return sortconfig.direction === 'ascending' ? -1 : 1;
					}
					if (a[sortconfig.key] > b[sortconfig.key]) {
						return sortconfig.direction === 'ascending' ? 1 : -1;
					}
					return 0;
				});
			}
			return sortedProducts;
		},
		[ rows, searchedData, sortconfig ]
	);
	const data = () => {
		fetch('/subrepo/zipdata', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((data) => data.json())
			.then((dat) => {
				if (dat.error) {
					//seterror(dat.error)
					return console.log(dat.error);
				}

				// setsuccess(dat)
				setrows(dat);
				console.log(dat);
			});
	};

	const filterManger = (A, B) => {
		var manage = datatrus.filter(
			(x) => (A && x.area !== '') || (B && x.area === '')
			// (!text || x.ua.toLowerCase().indexOf(text.toLowerCase()) > -1) &&
			// ((A && x.display != '') || (B && x.display === ''))
		);
		// console.log(manage);
		setrows(manage);
	};

	function SearchData() {
		let arr = [];
		let search = new RegExp(search1.replace(/\s+/g, '').trim().toLowerCase());
		arr = rows.filter((row) => {
			if (
				(row.pincode ? row.pincode : '').toString().replace(/\s+/g, '').trim().toLowerCase().match(search, 'ig')
			) {
				return row;
			}
		});
		console.log(arr);
		if (arr.length === 0) {
			setsearchedData('No Data Found!');
		} else {
			setsearchedData(arr);
			console.log('jvhvhvhv', arr);
		}
	}
	useEffect(() => {
		fetch('/subrepo/zipdata', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((data) => data.json())
			.then((dat) => {
				if (dat.error) {
					//seterror(dat.error)
					return console.log(dat.error);
				}

				// setsuccess(dat)
				setrows(dat);
				setdatatrus(dat);
				console.log(dat);
			});
	}, []);

	const headers = [
		{ key: 'pincode', label: 'Pincode' },
		{ key: 'requests', label: 'Requests' },
		{ key: 'avgrequest', label: 'Avg Requests' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'avgimpression', label: 'Avg Impressions' },
		{ key: 'click', label: 'Clicks' },
		{ key: 'area', label: 'Area' },
		{ key: 'lowersubcity', label: 'Lower Sub City' },
		{ key: 'subcity', label: 'Subcity' },
		{ key: 'city', label: 'City' },
		{ key: 'grandcity', label: 'Grand City' },
		{ key: 'district', label: 'District' },
		{ key: 'comparison', label: 'Comparison' },
		{ key: 'state', label: 'State' },
		{ key: 'grandstate', label: 'Grand State' },
		{ key: 'latitude', label: 'Latitude' },
		{ key: 'longitude', label: 'Longitude' }
	];
	var csvReport = {
		filename: `PincodeData.csv`,
		headers: headers,
		data: rows
	};

	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, rows, type);
		var setDatatrus = orderSetter(orde, column, datatrus, type);
		setrows(setData);
		setdatatrus(setDatatrus);
	};

	return (
		<div>
			<div>
				<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Pincode data </h4>
				<input
					placeholder="Search Pincode"
					onChange={(e) => setsearch(e.target.value)}
					style={{
						textAlign: 'center',
						width: '20%',
						padding: '0.1%',
						border: '1px solid rgba(61, 61, 64, .25)',
						background: '#ffffff'
					}}
				/>
				<button className="btn" style={{ marginLeft: '1%' }} onClick={SearchData}>
					Search
				</button>
			</div>
			<div className={classes.root}>
				{success ? (
					<Alert
						onClose={() => {
							setsuccess('');
						}}
						style={{ margin: '1%' }}
						severity="success"
					>
						{success}
					</Alert>
				) : (
					<React.Fragment />
				)}
				{error ? (
					<Alert
						onClose={() => {
							seterror('');
						}}
						style={{ margin: '1%' }}
						severity="error"
					>
						{error}
					</Alert>
				) : (
					''
				)}
			</div>

			<Paper>
				<CSVLink {...csvReport}>Download Table</CSVLink>
				{searchedData === 'No Data Found!' ? (
					<h7>{searchedData}</h7>
				) : (
					<TableContainer style={{ maxHeight: 440 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{/* <TableCell>{title}</TableCell> */}
									{
										<TableCell
											onClick={() => tablesorter('pincode', 'number')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Pincode{' '}
											{arrowRetuner(sa === 'pincode' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('requests', 'number')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Requests{' '}
											{arrowRetuner(sa === 'requests' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('avgrequest', 'number')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Avg Requests{' '}
											{arrowRetuner(sa === 'avgrequest' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('impression', 'number')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Impressions{' '}
											{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('avgimpression', 'number')}
											style={{ cursor: 'pointer' }}
										>
											Avg Impressions{' '}
											{arrowRetuner(sa === 'avgimpression' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('click', 'number')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Click {arrowRetuner(sa === 'click' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{<TableCell>CTR</TableCell>}
									{
										<TableCell
											onClick={() => tablesorter('area', 'string')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Urban/Rural{' '}
											{arrowRetuner(sa === 'area' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('lowersubcity', 'string')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Lower Sub City{' '}
											{arrowRetuner(sa === 'lowersubcity' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									<TableCell
										onClick={() => tablesorter('subcity', 'string')}
										style={{ cursor: 'pointer' }}
									>
										{' '}
										SubCity{arrowRetuner(sa === 'subcity' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('city', 'string')}
										style={{ cursor: 'pointer' }}
									>
										{' '}
										City {arrowRetuner(sa === 'city' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										onClick={() => tablesorter('grandcity', 'string')}
										style={{ cursor: 'pointer' }}
									>
										{' '}
										Grand City{' '}
										{arrowRetuner(sa === 'grandcity' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									{
										<TableCell
											onClick={() => tablesorter('district', 'string')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											District{' '}
											{arrowRetuner(sa === 'district' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('comparison', 'string')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Comparison{' '}
											{arrowRetuner(sa === 'comparison' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('state', 'string')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											State {arrowRetuner(sa === 'state' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('grandstate', 'string')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Grand State{' '}
											{arrowRetuner(
												sa === 'grandstate' ? (order === 'asc' ? '1' : '2') : '3'
											)}{' '}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('latitude', 'number')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Latitude{' '}
											{arrowRetuner(sa === 'latitude' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											onClick={() => tablesorter('longitude', 'number')}
											style={{ cursor: 'pointer' }}
										>
											{' '}
											Longitude{' '}
											{arrowRetuner(sa === 'longitude' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									<TableCell style={{ width: '10%' }}>
										<FormGroup>
											<FormControlLabel
												control={
													<Checkbox
														size="small"
														checked={datafilterstatus.B}
														onChange={(e) => {
															setdatafilterstatus({
																...datafilterstatus,
																B: e.target.checked
															});
															filterManger(datafilterstatus.A, e.target.checked);
														}}
													/>
												}
												label="Entries Not Done"
											/>
											<FormControlLabel
												control={
													<Checkbox
														size="small"
														checked={datafilterstatus.A}
														onChange={(e) => {
															setdatafilterstatus({
																...datafilterstatus,
																A: e.target.checked
															});
															filterManger(e.target.checked, datafilterstatus.B);
														}}
													/>
												}
												label="Entries Done"
											/>
										</FormGroup>
									</TableCell>
									{<TableCell />}
								</TableRow>
							</TableHead>
							<TableBody>
								{(searchedData.length !== 0 ? searchedData : rows)
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row) => (
										<TableRow key={row.name}>
											<TableCell component="th" scope="row">
												{row.pincode ? row.pincode : ''}
											</TableCell>
											<TableCell>{row.requests ? row.requests : ''}</TableCell>
											<TableCell>{row.avgrequest ? Math.round(row.avgrequest) : ''}</TableCell>
											<TableCell>{row.impression ? row.impression : ''}</TableCell>
											<TableCell>{row.impression ? Math.round(row.avgimpression) : ''}</TableCell>
											<TableCell>{row.click ? row.click : 0}</TableCell>
											<TableCell>
												{row.impression !== 0 ? (
													Math.round(row.click / row.impression * 100) / 100
												) : (
													0
												)}%
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
											<TableCell>{row.latitude ? row.latitude : ''}</TableCell>
											<TableCell>{row.longitude ? row.longitude : ''}</TableCell>

											<TableCell>
												<button className="btn" onClick={() => handleOpen(row)}>
													Edit{' '}
												</button>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>
				)}

				<TablePagination
					rowsPerPageOptions={[ 10, 100, 1000, 10000 ]}
					component="div"
					count={rows ? rows.length : 0}
					rowsPerPage={rowsPerPage}
					//style={{float:'left'}}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
				<ZipAudiodata />
				<ZipVideodata />
				<ZipBannerdata />
				{show ? (
					<div>
						<Modal
							open={open}
							onClose={handleClose}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description"
						>
							<div style={{ maxHeight: '100vh', 'overflow-y': 'auto' }} className={classes.paper}>
								<h4>Edit Zip Data</h4>
								<Zipdataform
									props={tempdata}
									setShow={setShow}
									setsuccess={setsuccess}
									data1={data}
									seterror={seterror}
								/>
							</div>
						</Modal>
					</div>
				) : (
					<React.Fragment />
				)}
			</Paper>
		</div>
	);
}
