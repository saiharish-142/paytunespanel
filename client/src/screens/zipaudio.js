import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import  {useForm} from 'react-hook-form'
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import { Alert } from '@material-ui/lab';
import { CSVLink } from 'react-csv';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	Modal
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
		padding: '2% 2% 2% 6%',
	}
}));

export default function ZipAudiodata() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [search1, setsearch] = useState('');
	const [searchedData, setsearchedData] = useState([]);
	const handleOpen = (data) => {
		setOpen(true);
		setShow(true)
		settempdata(data);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [error, seterror] = useState('');
	const [success, setsuccess] = useState('');
	const [rows, setrows] = useState([]);
	const [rowsPerPage, setRowsPerPage] = useState(7);
	const [page, setPage] = useState(0);
	const [sortconfig, setsortconfig] = useState({ key: 'impression', direction: 'descending' })
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const [show, setShow] = useState(false);
	const [tempdata, settempdata] = useState({});

	// const handleShow = (data) => {
	// 	setShow(true);
	// 	console.log(data);
	// 	settempdata(data);
	// };
	//const [make_model,setmakemodel]=useState("")

	const data = () => {
		fetch('/subrepo/zipdata_audio', {
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
	function SearchData() {
		let arr = [];
		let search=new RegExp(search1.replace(/\s+/g, '').trim().toLowerCase())
		arr = rows.filter(
			(row) =>{
				if ((row.pincode ? row.pincode : "").toString().replace(/\s+/g, '').trim().toLowerCase().match(search,'ig')   ) {
					return row
				}
				
			}
				
		);
		console.log(arr)
		if (arr.length === 0) {
			setsearchedData('No Data Found!');
		} else {		
			setsearchedData(arr);
			console.log('jvhvhvhv', arr);
		}
	}
	useEffect(() => {
		fetch('/subrepo/zipdata_audio', {
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
		{ key: 'longitude', label: 'Longitude' },
	];
	var csvReport = {
		filename: `PincodeaudioData.csv`,
		headers: headers,
		data: rows
	};

	React.useMemo(() => {
		let sortedProducts =  searchedData?searchedData: rows;
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
	  }, [rows, searchedData,sortconfig]);


	const requestSort = (key) => {
		let direction = 'ascending';
		if (sortconfig && sortconfig.key === key && sortconfig.direction === 'ascending') {
			direction = 'descending';
		}
		setsortconfig({ key, direction });
	}

	const getClassNamesFor = (name) => {
		if (!sortconfig) {
			return;
		}
		return sortconfig.key === name ? sortconfig.direction : undefined;
	};
	const arrowRetuner = (mode) => {
		if (mode === '1') {
			return <ArrowUpwardRoundedIcon fontSize="small" />;
		} else if (mode === '2') {
			return <ArrowDownwardRoundedIcon fontSize="small" />;
		} else {
			return <ArrowUpwardRoundedIcon fontSize="small" style={{ color: 'lightgrey' }} />;
		}
	};

	return (
		<div>
			<div>
				<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Pincode Audio Data </h4>
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
			<CSVLink {...csvReport}  >Download Table</CSVLink>
			{searchedData === 'No Data Found!' ? (
					<h7>{searchedData}</h7>
				) : (
				<TableContainer style={{ maxHeight: 440 }}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell onClick={() => requestSort('pincode')} className={getClassNamesFor('pincode')} style={{ cursor: 'pointer' }}> Pincode {arrowRetuner(sortconfig.key === 'pincode' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('requests')} className={getClassNamesFor('requests')} style={{ cursor: 'pointer' }}> Requests {arrowRetuner(sortconfig.key === 'requests' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('avgrequest')} className={getClassNamesFor('avgrequest')} style={{ cursor: 'pointer' }}> Avg Requests {arrowRetuner(sortconfig.key === 'avgrequest' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('impression')} className={getClassNamesFor('impression')} style={{ cursor: 'pointer' }}> Impressions {arrowRetuner(sortconfig.key === 'impression' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('avgimpression')} className={getClassNamesFor('avgimpression')} style={{ cursor: 'pointer' }}>Avg Impressions {arrowRetuner(sortconfig.key === 'avgimpression' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('click')} className={getClassNamesFor('click')} style={{ cursor: 'pointer' }}> Click {arrowRetuner(sortconfig.key === 'click' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell>CTR</TableCell>}
								{<TableCell onClick={() => requestSort('area')} className={getClassNamesFor('area')} style={{ cursor: 'pointer' }}> Urban/Rural {arrowRetuner(sortconfig.key === 'area' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('lowersubcity')} className={getClassNamesFor('lowersubcity')} style={{ cursor: 'pointer' }}> Lower Sub City {arrowRetuner(sortconfig.key === 'lowersubcity' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								<TableCell onClick={() => requestSort('subcity')} className={getClassNamesFor('subcity')} style={{ cursor: 'pointer' }}> SubCity {arrowRetuner(sortconfig.key === 'subcity' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>
								<TableCell onClick={() => requestSort('city')} className={getClassNamesFor('city')} style={{ cursor: 'pointer' }}> City {arrowRetuner(sortconfig.key === 'city' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>
								<TableCell onClick={() => requestSort('grandcity')} className={getClassNamesFor('grandcity')} style={{ cursor: 'pointer' }}> Grand City {arrowRetuner(sortconfig.key === 'grandcity' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>
								{<TableCell onClick={() => requestSort('district')} className={getClassNamesFor('district')} style={{ cursor: 'pointer' }}> District {arrowRetuner(sortconfig.key === 'district' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('comparison')} className={getClassNamesFor('comparison')} style={{ cursor: 'pointer' }}> Comparison {arrowRetuner(sortconfig.key === 'comparison' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('state')} className={getClassNamesFor('state')} style={{ cursor: 'pointer' }}>  State {arrowRetuner(sortconfig.key === 'state' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('grandstate')} className={getClassNamesFor('grandstate')} style={{ cursor: 'pointer' }}> Grand State {arrowRetuner(sortconfig.key === 'grandstate' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell onClick={() => requestSort('latitude')} className={getClassNamesFor('latitude')} style={{ cursor: 'pointer' }}> Latitude {arrowRetuner(sortconfig.key === 'latitude' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell onClick={() => requestSort('longitude')} className={getClassNamesFor('longitude')} style={{ cursor: 'pointer' }}> Longitude {arrowRetuner(sortconfig.key === 'longitude' ? (sortconfig.direction === 'ascending' ? '1' : '2') : '3')}</TableCell>}

								{<TableCell />}
							</TableRow>
						</TableHead>
						<TableBody>
							{
								(searchedData.length !== 0 ? searchedData : rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
									<TableRow key={row.name}>
										<TableCell component="th" scope="row">
											{row.pincode ? row.pincode : ''}
										</TableCell>
										<TableCell>{row.requests ? row.requests : ''}</TableCell>
										<TableCell>{row.avgrequest ? Math.round(row.avgrequest)  : ''}</TableCell>
										<TableCell>{row.impression ? row.impression : ''}</TableCell>
										<TableCell>{row.impression ? Math.round(row.avgimpression)  : ''}</TableCell>
										<TableCell>{row.click ? row.click : 0}</TableCell>
										<TableCell>{row.impression!==0 ? Math.round(((row.click/row.impression)*100))/100 : 0}%</TableCell>
										
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
					rowsPerPageOptions={[10, 100, 1000, 10000]}
					component="div"
					count={rows ? rows.length : 0}
					rowsPerPage={rowsPerPage}
					//style={{float:'left'}}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
				{/* {show ? (
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
				)} */}
			</Paper>
		</div>
	);
}
