import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import  {useForm} from 'react-hook-form'
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
	}
}));

export default function Zipdata() {
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
		console.log(data);
		settempdata(data);
	};
	//const [make_model,setmakemodel]=useState("")

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

	return (
		<div>
			<h4 style={{ margin: '3%', fontWeight: 'bolder' }}>Pincode data </h4>
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
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell><button onClick={()=>requestSort('pincode')} className={getClassNamesFor('pincode')}> Pincode </button></TableCell>}
								{<TableCell><button onClick={()=>requestSort('impression')} className={getClassNamesFor('impression')}> Impressions </button></TableCell>}
								{<TableCell><button onClick={()=>requestSort('click')} className={getClassNamesFor('click')}> Click </button></TableCell>}
								{<TableCell>CTR</TableCell>}
								{<TableCell><button onClick={()=>requestSort('area')} className={getClassNamesFor('area')}> Urban/Rural </button></TableCell>}
								{<TableCell><button onClick={()=>requestSort('lowersubcity')} className={getClassNamesFor('lowersubcity')}> Lower Sub City </button></TableCell>}
								<TableCell><button onClick={()=>requestSort('subcity')} className={getClassNamesFor('subcity')}> SubCity </button></TableCell>
								<TableCell><button onClick={()=>requestSort('city')} className={getClassNamesFor('city')}> City </button></TableCell>
								<TableCell><button onClick={()=>requestSort('grandcity')} className={getClassNamesFor('grandcity')}> Grand City </button></TableCell>
								{<TableCell><button onClick={()=>requestSort('district')} className={getClassNamesFor('district')}> District </button></TableCell>}
								{<TableCell><button onClick={()=>requestSort('comparison')} className={getClassNamesFor('comparison')}> Comparison </button></TableCell>}
								{<TableCell> <button onClick={()=>requestSort('state')} className={getClassNamesFor('state')}> State </button></TableCell>}
								{<TableCell><button onClick={()=>requestSort('grandstate')} className={getClassNamesFor('grandstate')}> Grand State </button></TableCell>}
								{<TableCell><button onClick={()=>requestSort('latitude')} className={getClassNamesFor('latitude')}> Latitude </button></TableCell>}
								{<TableCell><button onClick={()=>requestSort('longitude')} className={getClassNamesFor('longitude')}> Longitude </button></TableCell>}
								
								{<TableCell />}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows &&
								rows.length &&
								rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
									<TableRow key={row.name}>
										<TableCell component="th" scope="row">
											{row.pincode ? row.pincode : ''}
										</TableCell>
										<TableCell>{row.impression ? row.impression : ''}</TableCell>
										<TableCell>{row.click ? row.click : ''}</TableCell>
										<TableCell>{ row.impression!==0? Math.round(row.click/row.impression) :0}%</TableCell>
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
						<h4>Edit Zip Data</h4>
						<Zipdataform
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
