import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
// import { useForm } from 'react-hook-form';
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
	Modal
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

export default function PodcastCategorydata() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

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

	useEffect(() => {
		fetch('/subrepo/categorydata_podcast', {
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
		filename: `CategoryData.csv`,
		headers: headers,
		data: rows
	};

	React.useMemo(() => {
		let sortedProducts = rows;
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
	  }, [rows, sortconfig]);
	
	
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

	return (
		<div>
			<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Category Podcast data </h4>
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
				<TableContainer style={{maxHeight:440}}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('category')} className={getClassNamesFor('category')}>Category {arrowRetuner( sortconfig.key==='category'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('impression')} className={getClassNamesFor('impression')}>Impressions {arrowRetuner( sortconfig.key==='impression'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('avgimpression')} className={getClassNamesFor('avgimpression')}>Avg Impressions {arrowRetuner( sortconfig.key==='avgimpression'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('click')} className={getClassNamesFor('click')}>Clicks {arrowRetuner( sortconfig.key==='click'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('tier1')} className={getClassNamesFor('tier1')}>Tier1 {arrowRetuner( sortconfig.key==='tier1'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('tier2')} className={getClassNamesFor('tier2')}>Tier2 {arrowRetuner( sortconfig.key==='tier2'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('tier3')} className={getClassNamesFor('tier3')}>Tier3 {arrowRetuner( sortconfig.key==='tier3'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('tier4')} className={getClassNamesFor('tier4')}>Tier4 {arrowRetuner( sortconfig.key==='tier4'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('genderCategory')} className={getClassNamesFor('genderCategory')}>Gender Category {arrowRetuner( sortconfig.key==='genderCategory'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('AgeCategory')} className={getClassNamesFor('AgeCategory')}>Age category {arrowRetuner( sortconfig.key==='AgeCategory'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('new_taxonamy')} className={getClassNamesFor('new_taxonmay')}>New Taxonamy {arrowRetuner( sortconfig.key==='new_taxonamy'?(sortconfig.direction==='ascending'?'1':'2'):'3' )}</TableCell>}
								{<TableCell />}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
								<TableRow key={row.name}>
									<TableCell component="th" scope="row">
										{row.category ? row.category : ''}
									</TableCell>
									<TableCell>{row.impression ? row.impression : ''}</TableCell>
									<TableCell>{row.avgimpression ? Math.round(row.avgimpression) : ''}</TableCell>
									<TableCell>{row.click?row.click:''}</TableCell>
									<TableCell>{row.tier1 ? row.tier1 : ''}</TableCell>
									<TableCell>{row.tier2 ? row.tier2 : ''}</TableCell>
									<TableCell>{row.tier3 ? row.tier3 : ''}</TableCell>
									<TableCell>{row.tier4 ? row.tier4 : ''}</TableCell>
									<TableCell>{row.genderCategory ? row.genderCategory : ''}</TableCell>
									<TableCell>{row.AgeCategory ? row.AgeCategory : ''}</TableCell>
									<TableCell>{row.new_taxonamy ? row.new_taxonamy : ''}</TableCell>
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
