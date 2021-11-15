import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
// import { useForm } from 'react-hook-form';
import { orderSetter } from '../redux/actions/manageadsAction';
import { CSVLink } from 'react-csv';
import { Alert } from '@material-ui/lab';
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

import Categorydataform from '../components/categoryformdata';

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

export default function VideoCategorydata() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [search1, setsearch] = useState('');
	const [searchedData, setsearchedData] = useState([]);
	const [ datafilterstatus, setdatafilterstatus ] = useState({ A: true, B: true });
	const handleOpen = (data) => {
	  setOpen(true);
	  setShow(true)
	  settempdata(data);
	};
  
	const handleClose = () => {
	  setOpen(false);
	};
	const [ error, seterror ] = useState('');
	const [ success, setsuccess ] = useState('');
	const [ rows, setrows ] = useState([]);
	const [sortconfig,setsortconfig]=useState({key:'impression',direction:'descending'})
	const [ datatrus, setdatatrus ] = useState([]);
	const [ sa, setsa ] = React.useState('impression');
	const [ order, setorder ] = React.useState('desc');
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
	const [ page, setPage ] = useState(0);
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
	// 	settempdata(data);
	// };
	//const [make_model,setmakemodel]=useState("")

	// const data = () => {
	// 	fetch('/subrepo/categorydata', {
	// 		method: 'get',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		}
	// 	})
	// 		.then((data) => data.json())
	// 		.then((dat) => {
	// 			if (dat.error) {
	// 				//seterror(dat.error)
	// 				return console.log(dat.error);
	// 			}

	// 			// setsuccess(dat)
	// 			setrows(dat);
	// 			console.log(dat);
	// 		});
	// };
	function SearchData() {
		let arr = [];
		let search=new RegExp(search1.replace(/\s+/g, '').trim().toLowerCase())
		arr = rows.filter(
			(row) => {
				if ((row.category ? row.category : "").toString().replace(/\s+/g, '').trim().toLowerCase().match(search,'ig')   ) {
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

	const filterManger = (A, B) => {
		var manage = datatrus.filter(
			(x) =>
				(A && x.tier4!==""|| B && x.tier4==="" )
				// (!text || x.ua.toLowerCase().indexOf(text.toLowerCase()) > -1) &&
				// ((A && x.display != '') || (B && x.display === ''))
		);
		// console.log(manage);
		setrows(manage);
	};
	useEffect(() => {
		fetch('/subrepo/categorydata_video', {
			method: 'post',
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
		{ key: 'category', label: 'Category' },
		{ key: 'impression', label: 'Impressions' },
		{ key: 'avgimpression', label: 'Avg Impressions' },
		{ key: 'click', label: 'Clicks' },
		{ key: 'tier1', label: 'Tier1' },
		{ key: 'tier2', label: 'Tier2' },
		{ key: 'tier3', label: 'Tier3' },
		{ key: 'tier4', label: 'Tier4' },
		{ key: 'genderCategory', label: 'Gender Category' },
		{ key: 'AgeCategory', label: 'Age Category' },
		{ key: 'new_taxonamy', label: 'New Taxonamy' }
	];
	var csvReport = {
		filename: `VideoCategoryData.csv`,
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
	
	
	const requestSort=(key)=>{
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
				<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Category Video Data </h4>
				<input
					placeholder="Search Category"
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
				<TableContainer style={{maxHeight:440}}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('_id.category', 'string')} >Category {arrowRetuner(sa === '_id.category' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('impressions', 'number')} >Impressions {arrowRetuner(sa === 'impressions' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('avgimpression', 'number')} >Avg Impressions {arrowRetuner(sa === 'avgimpression' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('click', 'number')} >Clicks {arrowRetuner(sa === 'click' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('extra_details.tier1', 'string')} >Tier1 {arrowRetuner(sa === 'extra_details.tier1' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('extra_details.tier2', 'string')} >Tier2 {arrowRetuner(sa === 'extra_details.tier2' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('extra_details.tier3', 'string')} >Tier3 {arrowRetuner(sa === 'extra_details.tier3' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('extra_details.tier4', 'string')} >Tier4 {arrowRetuner(sa === 'extra_details.tier4' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('extra_details.genderCategory', 'string')} >Gender Category {arrowRetuner(sa === 'extra_details.genderCategory' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('extra_details.AgeCategory', 'string')} >Age category {arrowRetuner(sa === 'extra_details.AgeCategory' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>tablesorter('extra_details.new_taxonamy', 'string')} >New Taxonamy {arrowRetuner(sa === 'extra_details.new_taxonamy' ? (order === 'asc' ? '1' : '2') : '3')}</TableCell>}
								{<TableCell style={{width:'10%'}} >
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
										</TableCell>}
								{<TableCell />}
							</TableRow>
						</TableHead>
						<TableBody>
							{(searchedData.length !== 0 ? searchedData : rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
								<TableRow key={row.name}>
									<TableCell component="th" scope="row">
										{row._id.category ? row._id.category : ''}
									</TableCell>
									<TableCell>{row.impressions ? row.impressions : ''}</TableCell>
									<TableCell>{row.avgimpression ? Math.round(row.avgimpression) : ''}</TableCell>
									<TableCell>{row.CompanionClickTracking+row.SovClickTracking}</TableCell>
									<TableCell>{row.extra_details.tier1 ? row.extra_details.tier1 : ''}</TableCell>
									<TableCell>{row.extra_details.tier2 ? row.extra_details.tier2 : ''}</TableCell>
									<TableCell>{row.extra_details.tier3 ? row.extra_details.tier3 : ''}</TableCell>
									<TableCell>{row.extra_details.tier4 ? row.extra_details.tier4 : ''}</TableCell>
									<TableCell>{row.extra_details.genderCategory ? row.extra_details.genderCategory : ''}</TableCell>
									<TableCell>{row.extra_details.AgeCategory ? row.extra_details.AgeCategory : ''}</TableCell>
									<TableCell>{row.extra_details.new_taxonamy ? row.extra_details.new_taxonamy : ''}</TableCell>
									{/* <TableCell>
										<button className="btn" onClick={() =>  handleOpen(row)}>
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
					rowsPerPageOptions={[ 10, 100, 1000, 10000 ]}
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
		  		<div style={{maxHeight:'100vh','overflow-y':'auto'}} className={classes.paper}>
						<h4>Edit Category Data</h4>
						<Categorydataform
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
