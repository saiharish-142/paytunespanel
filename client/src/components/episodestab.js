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

export default function EpisodeTab(){

    const [rows,setrows]=useState([])
	const [sortconfig,setsortconfig]=useState({key:'impression',direction:'descending'})
	const [ rowsPerPage, setRowsPerPage ] = useState(100);
	const classes=useStyles()
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
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
            <Paper>
				{/* <CSVLink {...csvReport} style={{padding:'10px',marginTop:'20px'}} >Download Table</CSVLink> */}
			{/* {searchedData==='No Data Found!'? <h7>{searchedData}</h7>:   */}
            <TableContainer style={{maxHeight:440}}>
					<Table stickyHeader aria-label="sticky table" >
						<TableHead  style={{position:"sticky",top:0}}>
							<TableRow >
								{/* <TableCell>{title}</TableCell> */}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('episodename')} className={getClassNamesFor('episodename')}>  Episode Name {arrowRetuner( sortconfig.key==='episodename'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('request')} className={getClassNamesFor('request')}> Request {arrowRetuner( sortconfig.key==='request'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('publisher')} className={getClassNamesFor('publisher')}> Publisher {arrowRetuner( sortconfig.key==='publisher'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								{<TableCell style={{ cursor: 'pointer' }} onClick={()=>requestSort('category')} className={getClassNamesFor('category')}> Category {arrowRetuner( sortconfig.key==='category'?(sortconfig.direction==='ascending'?'1':'2'):'3' )} </TableCell>}
								
								{<TableCell />}
							</TableRow>
						</TableHead>
						<TableBody >
							{(rows ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
								<TableRow key={row.name}>
									<TableCell component="th" scope="row">
										{row.episodename ? row.episodename : ''}
									</TableCell>
									<TableCell>{row.request ? row.request : ''}</TableCell>
									<TableCell>{row.publisher ? row.publisher: ''}</TableCell>
									<TableCell>{row.category ? row.category : ''}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>  
				
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
				{/* {show ? (
					<div>
						 <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
		  <div style={{maxHeight:'100vh','overflow-y':'auto'}} className={classes.paper}>
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
				)} */}
			</Paper>
        </div>
    )



}