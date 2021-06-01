import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
	}
}));

export default function Phonedata() {
	const classes = useStyles();

	const [ error, seterror ] = useState('');
	const [ success, setsuccess ] = useState('');
	const [ rows, setrows ] = useState([]);
	const [ rowsPerPage, setRowsPerPage ] = useState(7);
	const [ page, setPage ] = useState(0);
	const [sortconfig,setsortconfig]=useState(null)
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
				console.log(dat);
			});
	}, []);
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
		if (sortconfig.key === key && sortconfig.direction === 'ascending') {
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

	return (
		<div>
			<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Phone data </h4>
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
				<TableContainer style={{maxHeight:440}}>
					<Table stickyHeader aria-label="sticky table" >
						<TableHead  style={{position:"sticky",top:0}}>
							<TableRow >
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell> <button onClick={()=>requestSort('make_model')} className={getClassNamesFor('make_model')}> Make_And_Model </button></TableCell>}
								{<TableCell> <button onClick={()=>requestSort('impression')} className={getClassNamesFor('impression')}>Impressions</button> </TableCell>}
								{<TableCell> <button onClick={()=>requestSort('click')} className={getClassNamesFor('click')}>Clicks</button> </TableCell>}
								{<TableCell> <button onClick={()=>requestSort('release')} className={getClassNamesFor('release')}>Release Month And Year</button> </TableCell>}
								<TableCell>  <button onClick={()=>requestSort('cost')} className={getClassNamesFor('cost')}>Release Cost or MRP</button> </TableCell>
								<TableCell>  <button onClick={()=>requestSort('company')} className={getClassNamesFor('company')}>Company Name</button> </TableCell>
								<TableCell>  <button onClick={()=>requestSort('model')} className={getClassNamesFor('model')}>Model</button> </TableCell>
								{<TableCell> <button onClick={()=>requestSort('type')} className={getClassNamesFor('type')}>Type of Device</button> </TableCell>}
								{<TableCell> <button onClick={()=>requestSort('total_percent')} className={getClassNamesFor('total_percent')}>% of Total</button></TableCell>}
								{<TableCell> <button onClick={()=>requestSort('cumulative')} className={getClassNamesFor('cumulative')}>Cumulative %</button></TableCell>}
								{<TableCell />}
							</TableRow>
						</TableHead>
						<TableBody >
							{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
								<TableRow key={row.name}>
									<TableCell component="th" scope="row">
										{row.make_model ? row.make_model : ''}
									</TableCell>
									<TableCell>{row.impressions ? row.impressions : ''}</TableCell>
									<TableCell>{row.click ? row.click : ''}</TableCell>
									<TableCell>{row.release ? row.release : ''}</TableCell>
									<TableCell>{row.cost ? row.cost : ''}</TableCell>
									<TableCell>{row.company ? row.company : ''}</TableCell>
									<TableCell>{row.model ? row.model : ''}</TableCell>
									<TableCell>{row.type ? row.type : ''}</TableCell>
									<TableCell>{row.total_percent ? row.total_percent : ''}</TableCell>
									<TableCell>{row.cumulative ? row.cumulative : ''}</TableCell>
									<TableCell>
										<button className="btn" onClick={() => handleShow(row)}>
											Edit{' '}
										</button>
									</TableCell>
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
				{show ? (
					<div>
						<h4>Edit Phone Data</h4>
						<Phonedataform
							props={tempdata}
							setShow={setShow}
							setsuccess={setsuccess}
							data1={data}
							seterror={seterror}
						/>
					</div>
				) : (
					<React.Fragment />
				)}
			</Paper>
		</div>
	);
}
