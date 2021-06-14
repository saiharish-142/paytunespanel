import React, { useEffect, useState } from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	makeStyles,
	Paper,
	TablePagination
} from '@material-ui/core';

const useStyles = makeStyles({
	table: {
		// minWidth: '55%',
		width: '98%'
	}
});

export default function Biddata() {
	const classes = useStyles();

	const [ rows, setrows ] = useState([]);
	const [ rows1, setrows1 ] = useState([]);
	const [ bids, setbid ] = useState([]);
	const [ bids1, setbids1 ] = useState([]);
	const [ bidwons, setbidwons ] = useState({ Triton_Data: [], Rubicon_Data: [] });
	const [ spentdata, setspentdata ] = useState({ Triton_Data: [], Rubicon_Data: [] });
	const [ rowsPerPage, setRowsPerPage ] = useState(7);
	const [ rowsPerPage1, setRowsPerPage1 ] = useState(7);
	const [ rowsPerPage2, setRowsPerPage2 ] = useState(10);
	const [sortconfig,setsortconfig]=useState({key:'appName',direction:'descending'})

	const [ page, setPage ] = useState(0);
	const [ page1, setPage1 ] = useState(0);
	const [ page2, setPage2 ] = useState(0);

	const [ publisherbids, setpublisherbids ] = useState([]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangePage1 = (event, newPage) => {
		setPage1(newPage);
	};

	const handleChangePage2 = (event, newPage) => {
		setPage2(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleChangeRowsPerPage1 = (event) => {
		setRowsPerPage1(+event.target.value);
		setPage1(0);
	};

	const handleChangeRowsPerPage2 = (event) => {
		setRowsPerPage2(+event.target.value);
		setPage2(0);
	};

	useEffect(() => {
		fetch('/rtbreq/get_reqreports_via_ssp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({ ssp: 'Triton' })
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					return console.log(data.error);
				}
				const data_sorted = data.sort((a, b) => new Date(b._id.Date) - new Date(a._id.Date));
				//console.log(data_sorted)
				setrows(data_sorted);
			});
	}, []);
	useEffect(() => {
		fetch('/rtbreq/get_reqreports_via_ssp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({ ssp: 'Rubicon' })
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.error) {
					return console.log(data.error);
				}
				const data_sorted = data.sort((a, b) => new Date(b._id.Date) - new Date(a._id.Date));
				//console.log(data_sorted)
				setrows1(data_sorted);
			});
	}, []);

	useEffect(() => {
		fetch('/rtbreq/get_resreports_via_ssp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({ ssp: 'Triton' })
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.error) {
					return console.log(data.error);
				}
				setbid(data);
			});
	}, []);

	useEffect(() => {
		fetch('/rtbreq/get_resreports_via_ssp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({ ssp: 'Rubicon' })
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.error) {
					return console.log(data.error);
				}
				setbids1(data);
			});
	}, []);

	useEffect(() => {
		fetch('/rtbreq/get_bids_won', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.error) {
					return console.log(data.error);
				}
				setbidwons(data[0]);
			});
	}, []);

	useEffect(() => {
		fetch('/rtbreq/spent_data_via_date', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data[0]);
				if (data.error) {
					return console.log(data.error);
				}
				setspentdata(data[0]);
			});
	}, []);

	useEffect(() => {
		fetch('/rtbreq/get_bids_won_publisher', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.error) {
					return console.log(data.error);
				}
				setpublisherbids(data);
			});
	}, []);

	const findspentdata = (date, key) => {
		const result =
			key === 'Triton'
				? spentdata.Triton_Data.filter((spent) => date === spent._id.Date)
				: spentdata.Rubicon_Data.filter((spent) => date === spent._id.Date);

		if (result.length !== 0) {
			return result[0].total_spent;
		}
		return 0;
	};

	const findbidwons = (date, key) => {
		const result =
			key === 'Triton'
				? bidwons.Triton_Data.filter((bid) => date === bid._id.Date)
				: bidwons.Rubicon_Data.filter((bid) => date === bid._id.Date);
		//const result=bidwons.filter((bids)=>bids._id.Date===date)
		if (result.length !== 0) {
			return result[0].impressions;
		}
		return 0;
	};

	const findbids = (date, mat) => {
		const res =
			mat === 'tri' ? bids.filter((bid) => date === bid._id.Date) : bids1.filter((bid) => date === bid._id.Date);
		//const res=bids.filter((bid)=>date===bid._id.Date)
		if (res.length !== 0) {
			return res[0].requests;
		}
		return 0;
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
			<h4>Bid Request Data Triton </h4>
			{/* <h4 style={{float:'right'}}>RTB Response Data </h4>  */}

			<TableContainer component={Paper} className={classes.table} style={{ margin: '1%' }}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>SSP</TableCell>
							<TableCell>Requests</TableCell>
							<TableCell>Bids Responded</TableCell>
							<TableCell>Bids Won</TableCell>
							<TableCell>Total Spent</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
							<TableRow key={row.name}>
								<TableCell component="th" scope="row">
									{row._id.Date}
								</TableCell>
								<TableCell>Triton</TableCell>
								<TableCell>{row.requests}</TableCell>
								<TableCell>{findbids(row._id.Date, 'tri')}</TableCell>
								<TableCell>{findbidwons(row._id.Date, 'Triton')}</TableCell>
								<TableCell>{findspentdata(row._id.Date, 'Triton')}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 7, 100, 1000, 10000 ]}
				component="div"
				count={rows ? rows.length : 0}
				rowsPerPage={rowsPerPage}
				//style={{float:'left'}}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>

			{/* <br/><br/><br/><br/>  */}
			<h4>Bid Request Data Rubicon </h4>
			<TableContainer component={Paper} className={classes.table} style={{ margin: '1%' }}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>SSP</TableCell>
							<TableCell>Requests</TableCell>
							<TableCell>Bids Responded</TableCell>
							<TableCell>Bids Won</TableCell>
							<TableCell>Total Spent</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows1.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1).map((row) => (
							<TableRow key={row.name}>
								<TableCell component="th" scope="row">
									{row._id.Date}
								</TableCell>
								<TableCell>Rubicon</TableCell>
								<TableCell>{row.requests}</TableCell>
								<TableCell>{findbids(row._id.Date, 'Rub')}</TableCell>
								<TableCell>{findbidwons(row._id.Date, 'Rubicon')}</TableCell>
								<TableCell>{findspentdata(row._id.Date, 'Rubicon')}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 7, 10, 25, 100, 1000, 10000 ]}
				component="div"
				count={rows1 ? rows1.length : 0}
				rowsPerPage={rowsPerPage1}
				//style={{float:'right'}}
				page={page1}
				onChangePage={handleChangePage1}
				onChangeRowsPerPage={handleChangeRowsPerPage1}
			/>

			<h4>Bid Wons Publisher Wise Today </h4>
			<TableContainer component={Paper} className={classes.table} style={{ margin: '1%' }}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell onClick={()=>requestSort('date')} className={getClassNamesFor('date')} style={{ cursor: 'pointer' }} >Date {arrowRetuner( sortconfig.key==='date'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>
							<TableCell onClick={()=>requestSort('appName')} className={getClassNamesFor('appName')} style={{ cursor: 'pointer' }} >App Name {arrowRetuner( sortconfig.key==='appName'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>
							<TableCell onClick={()=>requestSort('impressions')} className={getClassNamesFor('impressions')} style={{ cursor: 'pointer' }} >Bids Won {arrowRetuner( sortconfig.key==='impressions'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{publisherbids.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2).map((row) => (
							<TableRow key={row.name}>
								<TableCell component="th" scope="row">
									{row.date}
								</TableCell>
								<TableCell>{row.appName ? row.appName : ''} </TableCell>
								<TableCell  >{row.impressions ? row.impressions : 0}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 10, 25, 100, 1000, 10000 ]}
				component="div"
				count={publisherbids ? publisherbids.length : 0}
				rowsPerPage={rowsPerPage2}
				//style={{float:'right'}}
				page={page2}
				onChangePage={handleChangePage2}
				onChangeRowsPerPage={handleChangeRowsPerPage2}
			/>
		</div>
	);
}
