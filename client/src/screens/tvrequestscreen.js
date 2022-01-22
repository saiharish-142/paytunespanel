import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { CSVLink } from 'react-csv';
import { arrowRetuner } from '../components/CommonFun';
import { orderSetter } from '../redux/actions/manageadsAction';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper
} from '@material-ui/core';

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

export default function TvRequestdata() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const [search1, setsearch] = useState('');
	const [searchedData, setsearchedData] = useState([]);
	const [ datatrus, setdatatrus ] = useState([]);
	const [ datafilterstatus, setdatafilterstatus ] = useState({ A: true, B: true });
	const [error, seterror] = useState('');
	const [success, setsuccess] = useState('');
	const [rows, setrows] = useState([]);
	const [ sa, setsa ] = React.useState('date');
	const [ order, setorder ] = React.useState('desc');
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

	const data = () => {
		fetch('/rtbreq/tvdata', {
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
			(x) =>
				(A && x.area!==""|| B && x.area==="" )
				// (!text || x.ua.toLowerCase().indexOf(text.toLowerCase()) > -1) &&
				// ((A && x.display != '') || (B && x.display === ''))
		);
		// console.log(manage);
		setrows(manage);
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
		fetch('/rtbreq/tvdata', {
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
		{ key: 'date', label: 'Date' },
		{ key: 'publisherid', label: 'PublisherId' },
		{ key: 'rtbType', label: 'RtbType' },
		{ key: 'ssp', label: 'SSP' },
		{ key: 'request', label: 'Requests' }
	];
	var csvReport = {
		filename: `TVData.csv`,
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

	// React.useMemo(() => {
	// 	let sortedProducts =  searchedData?searchedData: rows;
	// 	if (sortconfig !== null) {
	// 	  sortedProducts.sort((a, b) => {
	// 		if (a[sortconfig.key] < b[sortconfig.key]) {
	// 		  return sortconfig.direction === 'ascending' ? -1 : 1;
	// 		}
	// 		if (a[sortconfig.key] > b[sortconfig.key]) {
	// 		  return sortconfig.direction === 'ascending' ? 1 : -1;
	// 		}
	// 		return 0;
	// 	  });
	// 	}
	// 	return sortedProducts;
	//   }, [rows, searchedData,sortconfig]);



	return (
		<div>
			<div>
				<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Tv Request Data </h4>
				{/* <input
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
				</button> */}
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
									{<TableCell onClick={() => tablesorter('date', 'string')}  style={{ cursor: 'pointer' }}> Date {arrowRetuner(sa === 'date' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
									{<TableCell onClick={() => tablesorter('publisherid', 'string')}  style={{ cursor: 'pointer' }}> Publisherid {arrowRetuner(sa === 'publisherid' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
									{<TableCell onClick={() => tablesorter('publishername', 'string')}  style={{ cursor: 'pointer' }}> PublisherName {arrowRetuner(sa === 'publishername' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
									{<TableCell onClick={() => tablesorter('rtbType', 'string')}  style={{ cursor: 'pointer' }}> Rtb Type {arrowRetuner(sa === 'rtbType' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
									{<TableCell onClick={() => tablesorter('ssp', 'string')} style={{ cursor: 'pointer' }}> SSP {arrowRetuner(sa === 'ssp' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
									{<TableCell onClick={() => tablesorter('request', 'number')}  style={{ cursor: 'pointer' }}>Requests {arrowRetuner(sa === 'request' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
									{/* <TableCell style={{ width: '10%' }}>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												size="small"
												checked={datafilterstatus.B}
												onChange={(e) => {
													setdatafilterstatus({ ...datafilterstatus, B: e.target.checked });
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
													setdatafilterstatus({ ...datafilterstatus, A: e.target.checked });
													filterManger(e.target.checked, datafilterstatus.B);
												}}
											/>
										}
										label="Entries Done"
									/>
								</FormGroup>
							</TableCell> */}
									{<TableCell />}
								</TableRow>
							</TableHead>
							<TableBody>
								
									{(searchedData.length !== 0 ? searchedData : rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
										<TableRow key={row.name}>
											<TableCell component="th" scope="row">
												{row.date ? row.date : ''}
											</TableCell>
											<TableCell>{row.publisherid ? row.publisherid : ''}</TableCell>
											<TableCell>{row.publishername ? row.publishername : ''}</TableCell>
											<TableCell>{row.rtbType ? row.rtbType : ''}</TableCell>
											<TableCell>{row.ssp ? row.ssp : ''}</TableCell>
											<TableCell>{row.request ? row.request : ''}</TableCell>
											{/* <TableCell>
												<button className="btn" onClick={() => handleOpen(row)}>
													Edit{' '}
												</button>
											</TableCell> */}
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
			</Paper>
		</div>
	);
}
