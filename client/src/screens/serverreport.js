import React, { useEffect, useState } from 'react';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
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

export default function ServerReport() {
	const classes = useStyles();

	const [ rows, setrows ] = useState([]);
	const [ rowsPerPage, setRowsPerPage ] = useState(7);
	
	const [sortconfig,setsortconfig]=useState({key:'appName',direction:'descending'})

	const [ page, setPage ] = useState(0);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	useEffect(() => {
		fetch('/subrepo/get_server_report', {
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
				setrows(data);
			});
	}, []);

	

	React.useMemo(() => {
		let sortedProducts = publisherbids;
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
			<h4>Server Report </h4>
			{/* <h4 style={{float:'right'}}>RTB Response Data </h4>  */}

			<TableContainer component={Paper} className={classes.table} style={{ margin: '1%' }}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i) => (
							<TableRow key={i}>
								<TableCell component="th" scope="row">
									{row.date}
								</TableCell>
								<TableCell>{row.name}</TableCell>
								<TableCell>{row.status}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 7, 100, 1000, 10000 ]}
				component="div"
				count={bids ? bids.length : 0}
				rowsPerPage={rowsPerPage}
				//style={{float:'left'}}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}
