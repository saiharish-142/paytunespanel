import React from 'react';
import { useEffect, useState } from 'react';
import PreLoader from '../components/loaders/PreLoader';
import {
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Modal,
	Paper,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow
} from '@material-ui/core';
// import Switch from '@material-ui/core/Switch';
import SearchIcon from '@material-ui/icons/Search';
import { arrowRetuner, UserAgentBody, UserAgentHead } from '../components/CommonFun';
import { orderSetter } from '../redux/actions/manageadsAction';
import ReactExport from 'react-data-export';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

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
	const [ datafilterstatus, setdatafilterstatus ] = useState({ A: true, B: true });
	const [ data, setdata ] = useState([]);
	const [ dataloading, setdataloading ] = useState(true);
	const [ dataerror, setdataerror ] = useState(false);
	const [ editload, seteditload ] = useState(false);
	const [ editdata, seteditdata ] = useState({ ua: '', display: '' });
	const [ sa, setsa ] = React.useState('requests');
	const [ order, setorder ] = React.useState('desc');
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
				var sad = result;
				sad.sort(function(a, b) {
					return b.requests - a.requests;
				});
				setdataloading(false);
				setdata(sad);
				setdatatrus(sad);
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
				// var manage = data;
				// manage.map((x) => {
				// 	if (x.ua === result.result.ua) {
				// 		x.display = result.result.display;
				// 	}
				// });
				// setdata(manage);
				var managetr = datatrus;
				managetr.map((x) => {
					if (x.ua === result.result.ua) {
						x.display = result.result.display;
					}
				});
				setdatatrus(managetr);
				filterManger(datafilterstatus.a, datafilterstatus.B);
				seteditload(false);
				seteditdata({ ua: '', display: '' });
				setOpen(false);
			});
	};
	const filterManger = (A, B) => {
		var manage = datatrus.filter(
			(x) =>
				(!text || x.ua.toLowerCase().indexOf(text.toLowerCase()) > -1) &&
				((A && x.display != '') || (B && x.display === ''))
		);
		// console.log(manage);
		setdata(manage);
	};
	const tablesorter = (column, type) => {
		var orde = sa === column ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
		setorder(orde);
		setsa(column);
		var setData = orderSetter(orde, column, data, type);
		var setDatatrus = orderSetter(orde, column, datatrus, type);
		setdata(setData);
		setdatatrus(setDatatrus);
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
	const Download = [
		{
			columns: UserAgentHead,
			data: datatrus.length && UserAgentBody(datatrus)
		}
	];
	const DownloadDisplay = [
		{
			columns: UserAgentHead,
			data: data.length && UserAgentBody(data)
		}
	];
	function ExeclDownload(props) {
		// console.log(props);
		const data = React.Children.map(props.children, (child) => {
			// console.log(child);
			if (child.props.dataSet && child.props.dataSet[0].data) {
				return child;
			} else {
				// console.log(child);
			}
		});
		// console.log(data);
		// console.log(data);
		return (
			<ExcelFile
				filename={props.filename}
				element={
					<Button variant="outlined" color="primary">
						{props.title}
					</Button>
				}
			>
				{/* <ExcelSheet dataSet={OverallDataDown.complete} name="Over all Summary Data" /> */}
				{data.map((child) => {
					return child;
				})}
			</ExcelFile>
		);
	}
	return (
		<div>
			<div className="heading">User Agent Data</div>
			<ExeclDownload filename={`User Agent Data`} title="Download Data">
				<ExcelSheet dataSet={Download} name="User Agent Data" />
			</ExeclDownload>
			<ExeclDownload filename={`User Agent Filtered Data`} title="Download Filtered Data">
				<ExcelSheet dataSet={DownloadDisplay} name="User Agent Data" />
			</ExeclDownload>
			<Paper className="tableCont">
				<div style={{ display: 'flex', alignItems: 'center', padding: '0px 20px 5px 20px' }}>
					<SearchIcon color="primary" fontSize="large" />
					<input
						type="text"
						placeholder="Search User Agent"
						value={text}
						onChange={(e) => {
							if (datafilterstatus.A && datafilterstatus.B) {
								var maange = datatrus.filter(
									(x) => x.ua.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
								);
								setdata(maange);
								settext(e.target.value);
							} else if (datafilterstatus.A) {
								var maange = datatrus.filter(
									(x) =>
										x.ua.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 && x.display != ''
								);
								setdata(maange);
								settext(e.target.value);
							} else if (datafilterstatus.B) {
								var maange = datatrus.filter(
									(x) =>
										x.ua.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 &&
										x.display === ''
								);
								setdata(maange);
								settext(e.target.value);
							} else {
								settext(e.target.value);
							}
						}}
					/>
				</div>
			</Paper>
			<Paper style={{ marginTop: '20px' }} className="tableCont">
				<TableContainer>
					<TableHead>
						<TableRow>
							<TableCell
								style={{ width: '40%' }}
								onClick={() => tablesorter('ua', 'string')}
								style={{ cursor: 'pointer' }}
							>
								User Agent{arrowRetuner(sa === 'ua' ? (order === 'asc' ? '1' : '2') : '3')}
							</TableCell>
							<TableCell
								style={{ width: '10%' }}
								onClick={() => tablesorter('requests', 'number')}
								style={{ cursor: 'pointer' }}
							>
								Requests{arrowRetuner(sa === 'requests' ? (order === 'asc' ? '1' : '2') : '3')}
							</TableCell>
							<TableCell
								style={{ width: '10%' }}
								onClick={() => tablesorter('avgreq', 'number')}
								style={{ cursor: 'pointer' }}
							>
								Average Requests{arrowRetuner(sa === 'avgreq' ? (order === 'asc' ? '1' : '2') : '3')}
							</TableCell>
							<TableCell
								style={{ width: '30%' }}
								onClick={() => tablesorter('display', 'string')}
								style={{ cursor: 'pointer' }}
							>
								Display Name{arrowRetuner(sa === 'display' ? (order === 'asc' ? '1' : '2') : '3')}
							</TableCell>
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
										label="Without Display"
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
										label="With Display"
									/>
								</FormGroup>
							</TableCell>
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
										<Button color="secondary">Edit Name</Button>
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
					{editload ? (
						<CircularProgress />
					) : (
						<Button
							onClick={() => {
								seteditload(true);
								submitEdit();
							}}
						>
							Submit
						</Button>
					)}
				</Paper>
			</Modal>
		</div>
	);
}

export default Useragentdata;
