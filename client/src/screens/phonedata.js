import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import { Alert } from '@material-ui/lab';
import { CSVLink } from 'react-csv';
import { arrowRetuner } from '../components/CommonFun';
import { orderSetter } from '../redux/actions/manageadsAction';
import PhoneAudiodata from './phonemodelaudio';
import PhoneVideodata from './phonemodelvideo';
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

import Phonedataform from '../components/phonedataform';

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

export default function Phonedata() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleOpen = (data) => {
		setOpen(true);
		setShow(true);
		settempdata(data);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [error, seterror] = useState('');
	const [success, setsuccess] = useState('');
	const [datatrus, setdatatrus] = useState([]);
	const [datafilterstatus, setdatafilterstatus] = useState({ A: true, B: true });
	const [rows, setrows] = useState([]);
	const [rowsPerPage, setRowsPerPage] = useState(100);
	const [ci, setci] = useState(0);
	const [cc, setcc] = useState(0);
	const [search1, setsearch] = useState('');
	const [searchedData, setsearchedData] = useState([]);
	const [ sa, setsa ] = React.useState('impressions');
	const [ order, setorder ] = React.useState('desc');
	const [page, setPage] = useState(0);
	const [sortconfig, setsortconfig] = useState({ key: 'impression', direction: 'descending' });
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const [show, setShow] = useState(false);
	const [tempdata, settempdata] = useState({});

	const handleShow = (data) => {
		setShow(true);
		settempdata(data);
	};
	//const [make_model,setmakemodel]=useState("")

	const data = () => {
		fetch('/subrepo/phonedata', {
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
				(A && x.release !== "" || B && x.release === "")
			// (!text || x.ua.toLowerCase().indexOf(text.toLowerCase()) > -1) &&
			// ((A && x.display != '') || (B && x.display === ''))
		);
		// console.log(manage);
		setrows(manage);
	};

	useEffect(() => {
		fetch('/subrepo/phonedata', {
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
		{ key: 'make_model', label: 'Make_Model' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'avgimpression', label: 'Avg Impressions' },
		{ key: 'click', label: 'Clicks' },
		{ key: 'release', label: 'Release Month and Year' },
		{ key: 'cost', label: 'Release Cost or Mrp' },
		{ key: 'company', label: 'Company Name' },
		{ key: 'model', label: 'Model' },
		{ key: 'type', label: 'Type of Device' },
		{ key: 'total_percent', label: 'Total Percent' },
		{ key: 'cumulative', label: 'Cumulative' }
	];
	var csvReport = {
		filename: `PhoneData.csv`,
		headers: headers,
		data: rows
	};

	// React.useMemo(() => {
	// 	let sortedProducts = searchedData ? searchedData : rows;
	// 	if (sortconfig !== null) {
	// 		sortedProducts.sort((a, b) => {
	// 			if (a[sortconfig.key] < b[sortconfig.key]) {
	// 				return sortconfig.direction === 'ascending' ? -1 : 1;
	// 			}
	// 			if (a[sortconfig.key] > b[sortconfig.key]) {
	// 				return sortconfig.direction === 'ascending' ? 1 : -1;
	// 			}
	// 			return 0;
	// 		});
	// 	}
	// 	return sortedProducts;
	// }, [rows, searchedData, sortconfig]);

	


	function SearchData() {
		let arr = [];
		let search = new RegExp(search1.replace(/\s+/g, '').trim().toLowerCase())
		arr = rows.filter(
			(row) => {
				if ((row.make_model ? row.make_model : "").toString().replace(/\s+/g, '').trim().toLowerCase().match(search, 'ig')) {
					return row
				}
			}
			// row.make_model.toString().replace(/\s+/g, '').trim().toLowerCase() ===
			// search1.replace(/\s+/g, '').trim().toLowerCase()
		);
		if (arr.length === 0) {
			setsearchedData('No Data Found!');
		} else {
			var ai = 0,
				ac = 0;
			if (arr.length) {
				arr.map((x) => {
					ai += parseInt(x.impression);
					ac += parseInt(x.click);
				});
			}
			setci(ai);
			setcc(ac);
			setsearchedData(arr);
			console.log('jvhvhvhv', arr);
		}
	}
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
				<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Device Overall Data </h4>
				<input
					placeholder="Search PhoneModel"
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
				<CSVLink {...csvReport} style={{ padding: '10px', marginTop: '20px' }}>
					Download Table
				</CSVLink>
				{searchedData === 'No Data Found!' ? (
					<h7>{searchedData}</h7>
				) : (
					<TableContainer style={{ maxHeight: 440 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead style={{ position: 'sticky', top: 0 }}>
								<TableRow>
									{/* <TableCell>{title}</TableCell> */}
									{
										<TableCell
											style={{ cursor: 'pointer' }}
											onClick={() => tablesorter('make_model', 'string')}
											// className={getClassNamesFor('make_model')}
										>
											{' '}
											Make_And_Model{arrowRetuner(sa === 'make_model' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											style={{ cursor: 'pointer' }}
											onClick={() => tablesorter('impression', 'number')}
											// className={getClassNamesFor('impression')}
										>
											{' '}
											Impressions{arrowRetuner(sa === 'impression' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											style={{ cursor: 'pointer' }}
											onClick={() => tablesorter('avgimpression', 'number')}
											// className={getClassNamesFor('avgimpression')}
										>
											{' '}
											Avg Impression{arrowRetuner(sa === 'avgimpression' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											style={{ cursor: 'pointer' }}
											onClick={() => tablesorter('click', 'number')}
											// className={getClassNamesFor('click')}
										>
											{' '}
											Click{arrowRetuner(sa === 'click' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									{
										<TableCell
											style={{ cursor: 'pointer' }}
											onClick={() => tablesorter('release', 'string')}
											// className={getClassNamesFor('release')}
										>
											{' '}
											Release Month And Year{arrowRetuner(sa === 'release' ? (order === 'asc' ? '1' : '2') : '3')}
										</TableCell>
									}
									<TableCell
										style={{ cursor: 'pointer' }}
										onClick={() => tablesorter('cost', 'number')}
										// className={getClassNamesFor('cost')}
									>
										{' '}
											Release Cost And Mrp{arrowRetuner(sa === 'cost' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										style={{ cursor: 'pointer' }}
										onClick={() => tablesorter('company', 'string')}
										// className={getClassNamesFor('company')}
									>
										{' '}
											Company Name{arrowRetuner(sa === 'company' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									<TableCell
										style={{ cursor: 'pointer' }}
										onClick={() => tablesorter('model', 'string')}
										// className={getClassNamesFor('model')}
									>
										{' '}
											Model{arrowRetuner(sa === 'model' ? (order === 'asc' ? '1' : '2') : '3')}
									</TableCell>
									{
										<TableCell
											style={{ cursor: 'pointer' }}
											onClick={() => tablesorter('type', 'string')}
											// className={getClassNamesFor('type')}
										>
											{' '}
											Type{arrowRetuner(sa === 'type' ? (order === 'asc' ? '1' : '2') : '3')}
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
									</TableCell>
									{<TableCell />}
								</TableRow>
							</TableHead>
							<TableBody>
								{(searchedData.length !== 0 ? searchedData : rows)
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row) => (
										<TableRow key={row._id}>
											<TableCell component="th" scope="row">
												{row._id ? row._id : ''}
											</TableCell>
											<TableCell>{row.impression ? row.impression : ''}</TableCell>
											<TableCell>
												{' '}
												{row.avgimpression ? Math.round(row.avgimpression) : ''}
											</TableCell>
											<TableCell>{row.click ? row.click : ''}</TableCell>
											<TableCell>{row.release ? row.release : ''}</TableCell>
											<TableCell>{row.cost ? row.cost : ''}</TableCell>
											<TableCell>{row.company ? row.company : ''}</TableCell>
											<TableCell>{row.model ? row.model : ''}</TableCell>
											<TableCell>{row.type ? row.type : ''}</TableCell>
											<TableCell>
												<button className="btn" onClick={() => handleOpen(row)}>
													Edit{' '}
												</button>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
							<TableBody>
								<TableRow>
									<TableCell className="boldClass">Total</TableCell>
									<TableCell className="boldClass">{ci}</TableCell>
									<TableCell />
									<TableCell className="boldClass">{cc}</TableCell>
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				)}

				<TablePagination
					rowsPerPageOptions={[100, 1000, 10000]}
					component="div"
					count={rows ? rows.length : 0}
					rowsPerPage={rowsPerPage}
					//style={{float:'left'}}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
				<PhoneAudiodata />
				<PhoneVideodata />
				{show ? (
					<div>
						<Modal
							open={open}
							onClose={handleClose}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description"
						>
							<div style={{ maxHeight: '100vh', 'overflow-y': 'auto' }} className={classes.paper}>
								<h4>Edit Phone Data</h4>
								<Phonedataform
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
