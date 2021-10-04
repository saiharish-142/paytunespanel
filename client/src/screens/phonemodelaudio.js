import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
		padding: '2% 2% 2% 6%',
	  }
}));

export default function PhoneAudiodata() {
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
	const [ rowsPerPage, setRowsPerPage ] = useState(100);
	const [search1,setsearch ] = useState('')
	const [searchedData, setsearchedData ]=useState([])
	const [ page, setPage ] = useState(0);
	const [sortconfig,setsortconfig]=useState({key:'impression',direction:'descending'})
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const [ show, setShow ] = useState(false);
	const [ tempdata, settempdata ] = useState({});

	const handleShow = (data) => {
		setShow(true);
		settempdata(data);
	};
	//const [make_model,setmakemodel]=useState("")

	const data = () => {
		fetch('/subrepo/phonedata_audio', {
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

	useEffect(() => {
		fetch('/subrepo/phonedata_audio', {
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
		{ key: 'cumulative', label: 'Cumulative' },
	];
	var csvReport = {
		filename: `PhoneaudioData.csv`,
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

	function SearchData(){
		let arr=[]
		let search=new RegExp(search1.replace(/\s+/g, '').trim().toLowerCase())
		arr=rows.filter((row)=> 
		{
			if ((row.make_model ? row.make_model : "").toString().replace(/\s+/g, '').trim().toLowerCase().match(search,'ig')   ) {
				return row
			}
		})
		if(arr.length===0){
			setsearchedData('No Data Found!')
		}else{
			setsearchedData(arr)
			console.log('jvhvhvhv',arr)
		}	
	}

	return (
		<div>
			<div>
			<div>
				<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Phone Audio Data </h4>
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
				<CSVLink {...csvReport} style={{padding:'10px',marginTop:'20px'}} >Download Table</CSVLink>
			{searchedData==='No Data Found!'? <h7>{searchedData}</h7>:  <TableContainer style={{maxHeight:440}}>
					<Table stickyHeader aria-label="sticky table" >
						<TableHead  style={{position:"sticky",top:0}}>
							<TableRow >
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('make_model')} className={getClassNamesFor('make_model')}>  Make_And_Model {arrowRetuner( sortconfig.key==='make_model'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('impression')} className={getClassNamesFor('impression')}> Impressions {arrowRetuner( sortconfig.key==='impression'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('avgimpression')} className={getClassNamesFor('avgimpression')}> Avg Impressions {arrowRetuner( sortconfig.key==='avgimpression'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('click')} className={getClassNamesFor('click')}> Clicks {arrowRetuner( sortconfig.key==='click'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('release')} className={getClassNamesFor('release')}> Release Month And Year {arrowRetuner( sortconfig.key==='release'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('cost')} className={getClassNamesFor('cost')}>  Release Cost or MRP {arrowRetuner( sortconfig.key==='cost'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('company')} className={getClassNamesFor('company')}>  Company Name {arrowRetuner( sortconfig.key==='company'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>
								<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('model')} className={getClassNamesFor('model')}>  Model {arrowRetuner( sortconfig.key==='model'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('type')} className={getClassNamesFor('type')}> Type of Device {arrowRetuner( sortconfig.key==='type'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								
								{<TableCell />}
							</TableRow>
						</TableHead>
						<TableBody >
							{(searchedData.length!==0 ?searchedData: rows  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
								<TableRow key={row.name}>
									<TableCell component="th" scope="row">
										{row.make_model ? row.make_model : ''}
									</TableCell>
									<TableCell>{row.impression ? row.impression : ''}</TableCell>
									<TableCell>  {row.avgimpression ? Math.round(row.avgimpression)  : ''}</TableCell>
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
					</Table>
				</TableContainer>  }
				
				<TablePagination
					rowsPerPageOptions={[ 100, 1000, 10000 ]}
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
