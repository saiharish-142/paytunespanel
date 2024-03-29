import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import { Alert } from '@material-ui/lab';
import { CSVLink } from 'react-csv';
import { languagesmap } from '../helper';
import Episodedataform from '../screens/episodedataform';
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
	Paper,
	Modal,
	FormControlLabel,
	FormGroup,
	Checkbox
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



export default function EpisodeTab() {

	const [rows, setrows] = useState([])
	const [search1, setsearch] = useState('');
	const [searchedData, setsearchedData] = useState([]);
	const [sortconfig, setsortconfig] = useState({ key: 'impression', direction: 'descending' })
	const [error, seterror] = useState('');
	const [ datatrus, setdatatrus ] = useState([]);
	const [ datafilterstatus, setdatafilterstatus ] = useState({ A: true, B: true });
	const [success, setsuccess] = useState('');
	const [rowsPerPage, setRowsPerPage] = useState(100);
	const [page, setPage] = useState(0);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('desc');
	const [ischecked, setchecked] = useState(false);
	const [ischecked1, setchecked1] = useState(false);
	const [tempdata, settempdata] = useState({});
	const classes = useStyles()
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const [open, setOpen] = React.useState(false);
	const [show, setShow] = useState(false);
	const handleOpen = (data) => {
		setOpen(true);
		setShow(true)
		settempdata(data);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const langmap=new Map(languagesmap)

	const filterManger = (A, B) => {
		var manage = datatrus.filter(
			(x) =>
				(A && x.displayname!==""|| B && x.displayname==="" )
				// (!text || x.ua.toLowerCase().indexOf(text.toLowerCase()) > -1) &&
				// ((A && x.display != '') || (B && x.display === ''))
		);
		// console.log(manage);
		setrows(manage);
	};

	const headers = [
		{ key: 'episodename', label: 'Episode Name' },
		{ key: 'request', label: 'Request' },
		{ key: 'avgrequest', label: 'Avg Requests' },
		{ key: 'publisher', label: 'Publisher Name' },
		{ key: 'category', label: 'Category' },
		{ key: 'tier1', label: 'Tier1' },
		{ key: 'tier2', label: 'Tier2' },
		{ key: 'tier3', label: 'Tier3' },
		{ key: 'displayname', label: 'Display Name' },
		{ key: 'hostPossibility', label: 'Host Possibility' },
	];

	const handlechange = () => {
		setchecked(!ischecked);
	}
	const handlechange1 = () => {
		setchecked1(!ischecked1);
	}

	function SearchData() {
		let arr = [];
		let search = new RegExp(search1.replace(/\s+/g, '').trim().toLowerCase());
		arr = rows.filter(
			(row) => {
				if ((row.episodename ? row.episodename : "").toString().replace(/\s+/g, '').trim().toLowerCase().match(search, 'ig')) {
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

	var csvReport = {
		filename: `EpisodeData.csv`,
		headers: headers,
		data: rows
	};

	useEffect(() => {
		fetch('/rtbreq/getepisodewise_report', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((data) => data.json())
			.then((dat) => {
				if (dat.error) {
					// seterror(dat.error)
					return console.log(dat.error);
				}

				// setsuccess(dat)
				setrows(dat);
				setdatatrus(dat);
				console.log(dat);
			});
	}, []);

	const data = () => {
		fetch('/rtbreq/getepisodewise_report', {
			method: 'POST',
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

	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, rows, type);
		var setDatatrus = orderSetter(orde, column, datatrus, type);
		setrows(setData);
		setdatatrus(setDatatrus);
	};

	

	// const arrowRetuner = (mode) => {
	// 	if (mode === '1') {
	// 		return <ArrowUpwardRoundedIcon fontSize="small" />;
	// 	} else if (mode === '2') {
	// 		return <ArrowDownwardRoundedIcon fontSize="small" />;
	// 	} else {
	// 		return <ArrowUpwardRoundedIcon fontSize="small" style={{ color: 'lightgrey' }} />;
	// 	}
	// };

	function fetchcategory(category) {
		let array = []
		category.map(cat => {
			if (cat.split(',').length > 1) {
				let categ = cat.split(',')
				categ.map(cat1 => {
					fetch('/rtbreq/getcategory', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({ category: cat1 })
					})
						.then((data) => data.json())
						.then((dat) => {
							if (dat.error) {
								//seterror(dat.error)
								return console.log(dat.error);
							}

							// setsuccess(dat)
							array.push(dat.category)
						});
				})
			} else {
				fetch('/rtbreq/getcategory', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + localStorage.getItem('jwt')
					},
					body: JSON.stringify({ category: cat })
				})
					.then((data) => data.json())
					.then((dat) => {
						if (dat.error) {
							//seterror(dat.error)
							return console.log(dat.error);
						}

						// setsuccess(dat)
						array.push(dat.category)
					});
			}
		})
		console.log(array)
		// setcategorydata(array)
		return array
	}

	return (
		<div>
			<div>
				<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Episode Data Tab</h4>
				<input placeholder="Search Episode Name" onChange={(e) => setsearch(e.target.value)} style={{ textAlign: 'center', width: '20%', padding: '0.1%', border: '1px solid rgba(61, 61, 64, .25)', background: '#ffffff' }} />
				<button className="btn" style={{ marginLeft: '1%' }} onClick={SearchData} >Search</button>
				



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
				<CSVLink {...csvReport} style={{ padding: '10px', marginTop: '20px' }} >Download Table</CSVLink>
				
				{searchedData === 'No Data Found!' ? (
					<h7>{searchedData}</h7>
				) : (<TableContainer style={{ maxHeight: 440, maxWidth: '100%' }}>
					<Table stickyHeader aria-label="sticky table" >
						<TableHead style={{ position: "sticky", top: 0 }}>
							<TableRow >
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell style={{ cursor: 'pointer', width: 30 }} onClick={() => tablesorter('episodename', 'string')} > Display Name {arrowRetuner(sa === 'episodename' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer', width: 30 }} onClick={() => tablesorter('language', 'string')} > Language {arrowRetuner(sa === 'language' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }}onClick={() => tablesorter('request', 'number')} > Request {arrowRetuner(sa === 'request' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('avgrequest', 'number')} >Avg Request {arrowRetuner(sa === 'avgrequest' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('publisher', 'string')} > Host {arrowRetuner(sa === 'publisher' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('category', 'string')} > Category {arrowRetuner(sa === 'category' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('tier1', 'string')} > Tier1 {arrowRetuner(sa === 'tier1' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('tier2', 'string')} > Tier2 {arrowRetuner(sa === 'tier2' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('tier3', 'string')} > Tier3 {arrowRetuner(sa === 'tier3' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('displayname', 'string')} >  Episode Name {arrowRetuner(sa === 'displayname' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('publishername', 'string')} > Publisher Name {arrowRetuner(sa === 'publishername' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={() => tablesorter('hostPossibility', 'string')} > Host Possibility {arrowRetuner(sa === 'hostPossibility' ? (order === 'asc' ? '1' : '2') : '3')} </TableCell>}
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
						<TableBody >
							{(searchedData.length !== 0 ? searchedData : rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
								<TableRow key={row.name}>
									<TableCell component="th" scope="row">
										{row.episodename ? row.episodename : ''}
									</TableCell>
									<TableCell>{row.language?  langmap.get(row.language) ? langmap.get(row.language) : '':''}</TableCell>
									<TableCell>{row.request ? row.request : ''}</TableCell>
									<TableCell>{row.avgrequest ? Math.round(row.avgrequest) : ''}</TableCell>
									<TableCell>{row.publisher ? row.publisher : ''}</TableCell>
									<TableCell>{row.category === "#N/A" ? row.new_taxonamy : row.category}</TableCell>
									<TableCell>{row.tier1 ? row.tier1 : ''}</TableCell>
									<TableCell>{row.tier2 ? row.tier2 : ''}</TableCell>
									<TableCell>{row.tier3 ? row.tier3 : ''}</TableCell>
									<TableCell>{row.displayname ? row.displayname : ''}</TableCell>
									<TableCell>{row.publishername ? row.publishername : ''}</TableCell>
									<TableCell>{row.hostPossibility ? row.hostPossibility : ''}</TableCell>

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
					rowsPerPageOptions={[100, 1000, 10000]}
					component="div"
					count={rows ? rows.length : 0}
					rowsPerPage={rowsPerPage}
					//style={{float:'left'}}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
				{show ? (
					<div>
						<Modal
							open={open}
							onClose={handleClose}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description"
						>
							<div style={{ maxHeight: '100vh', 'overflow-y': 'auto' }} className={classes.paper}>
								<h4>Edit Episode Data</h4>
								<Episodedataform
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
	)



}