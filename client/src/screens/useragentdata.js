import React from 'react';
import { useEffect, useState } from 'react';
import PreLoader from '../components/loaders/PreLoader';
import {
	Button,
	CircularProgress,
	Modal,
	Paper,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		position: 'absolute',
		top: `50%`,
		left: `50%`,
		transform: `translate(-${top}%, -${left}%)`,
		minWidth: '300px',
		maxWidth: '80vw',
		minHeight: '400px',
		width: 'fit-content',
		textAlign: 'center',
		padding: '20px'
	};
}

function Useragentdata() {
	const [ modalStyle ] = React.useState(getModalStyle);
	const [ open, setOpen ] = React.useState(false);
	const [ text, settext ] = useState('');
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ page, setPage ] = React.useState(0);
	const [ datatrus, setdatatrus ] = useState([]);
	const [ data, setdata ] = useState([]);
	const [ dataloading, setdataloading ] = useState(true);
	const [ dataerror, setdataerror ] = useState(false);
	const [ editload, seteditload ] = useState(false);
	const [ editdata, seteditdata ] = useState({ ua: '', display: '' });
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	useEffect(() => {
		fetch('/useragent/getuseragentdata', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				if (result.error) {
					return setdataerror(true);
				}
				setdataloading(false);
				setdata(result);
				setdatatrus(result);
			})
			.catch((err) => {
				console.log(err);
				setdataerror(true);
			});
	}, []);
	const submitEdit = () => {
		console.log(editdata);
		fetch('/useragent/adddisplay', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				ua: editdata.ua,
				display: editdata.display
			})
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				var manage = data;
				manage.map((x) => {
					if (x.ua === result.result.ua) {
						x.display = result.result.display;
					}
				});
				setdata(manage);
				var managetr = datatrus;
				managetr.map((x) => {
					if (x.ua === result.result.ua) {
						x.display = result.result.display;
					}
				});
				setdatatrus(manage);
				seteditdata({ ua: '', display: '' });
				setOpen(false);
			});
	};
	if (dataloading) {
		return (
			<React.Fragment>
				{/* <MLoader /> */}
				<PreLoader />
			</React.Fragment>
		);
	}
	if (dataerror) {
		return <h2>Something went Wrong Try again..</h2>;
	}
	return (
		<div>
			<div className="heading">User Agent Data</div>
			<Paper className="tableCont">
				<div style={{ display: 'flex', alignItems: 'center', padding: '0px 20px 5px 20px' }}>
					<SearchIcon color="primary" fontSize="large" />
					<input
						type="text"
						placeholder="Search User Agent"
						value={text}
						onChange={(e) => {
							var maange = datatrus.filter(
								(x) => x.ua.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
							);
							setdata(maange);
							settext(e.target.value);
						}}
					/>
				</div>
			</Paper>
			<Paper style={{ marginTop: '20px' }} className="tableCont">
				<TableContainer>
					<TableHead>
						<TableRow>
							<TableCell style={{ width: '40%' }}>User Agent</TableCell>
							<TableCell style={{ width: '10%' }}>Requests</TableCell>
							<TableCell style={{ width: '10%' }}>Average Requests</TableCell>
							<TableCell style={{ width: '30%' }}>Display Name</TableCell>
							<TableCell style={{ width: '10%' }} />
						</TableRow>
					</TableHead>
					<TableBody>
						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
							return (
								<TableRow key={i}>
									<TableCell style={{ width: '40%' }}>{row.ua}</TableCell>
									<TableCell style={{ width: '10%' }}>{row.requests}</TableCell>
									<TableCell style={{ width: '10%' }}>{Math.round(row.avgreq * 100) / 100}</TableCell>
									<TableCell style={{ width: '30%' }}>{row.display}</TableCell>
									<TableCell
										style={{ width: '10%' }}
										onClick={() => {
											setOpen(true);
											seteditdata({ ua: row.ua, display: row.display });
										}}
									>
										<Button variant="contained" color="primary">
											Edit Name
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[ 5, 10, 25, 100, 1000 ]}
					component="div"
					count={data ? data.length : 0}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<Modal
				open={open}
				onClose={() => {
					setOpen(false);
					seteditdata({
						ua: '',
						display: ''
					});
				}}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<Paper style={modalStyle}>
					<b>{editdata.ua}</b>
					<input
						placeholder="Enter the Display Name"
						value={editdata.display}
						onChange={(e) => seteditdata({ ...editdata, display: e.target.value })}
					/>
					{editload ? <CircularProgress /> : <Button onClick={() => submitEdit()}>Submit</Button>}
				</Paper>
			</Modal>
		</div>
	);
}

export default Useragentdata;
