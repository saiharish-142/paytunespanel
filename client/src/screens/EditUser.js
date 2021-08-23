import {
	Button,
	CircularProgress,
	FormControl,
	IconButton,
	Input,
	InputLabel,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
// import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
// import EditIcon from '@material-ui/icons/Edit';
// import CancelIcon from '@material-ui/icons/Cancel';
// import M from 'materialize-css';
import { useHistory, useParams } from 'react-router-dom';
import PreLoader from '../components/loaders/PreLoader';
import Modal from '@material-ui/core/Modal';
import FormLabel from '@material-ui/core/FormLabel';
// import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
// import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { loadAds, loadingAds } from '../redux/actions/manageadsAction';
import { loadBundles, loadingBundles } from '../redux/actions/manageBundlesAction';

// function rand() {
// 	return Math.round(Math.random() * 20) - 10;
// }

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

function EditUser() {
	const { id } = useParams();
	const history = useHistory();
	const dispatchRedux = useDispatch();
	const manageads = useSelector((state) => state.manageads);
	const managebundles = useSelector((state) => state.managebundles);
	const [ modalStyle ] = React.useState(getModalStyle);
	const [ email, setemail ] = useState('');
	const [ usertype, setusertype ] = useState('');
	const [ username, setusername ] = useState('');
	const [ loading, setloading ] = useState(true);
	// const [ campload, setcampload ] = useState(true);
	// const [ bundload, setbundload ] = useState(true);
	// const [ comploadb, setcomploadb ] = useState(true);
	// const [ comploadc, setcomploadc ] = useState(true);
	const [ texterror, settexterror ] = useState(false);
	// const [ user, setuser ] = useState(0);
	const [ titlesadding, settitlesadding ] = useState({
		title: '',
		audio: false,
		display: false,
		musicapps: false,
		video: false,
		podcast: false,
		onDemand: false
	});
	const [ selectedsemicampaigns, setselectedsemicampaigns ] = useState({
		_id: '',
		submitType: '',
		userid: '',
		title: '',
		searchName: '',
		adtitle: '',
		titles: [],
		type: '',
		endDate: null,
		startDate: null,
		PricingModel: null,
		audio: null,
		audio: null,
		display: null,
		video: null,
		musicapps: null,
		onDemand: null,
		podcast: null
	});
	const [ selectedcampaigns, setselectedcampaigns ] = useState([]);
	const [ searchedcampaigns, setsearchedcampaigns ] = useState([]);
	const [ campaigns, setcampaigns ] = useState([]);
	// const [ selectedbundles, setselectedbundles ] = useState([]);
	const [ searchedbundles, setsearchedbundles ] = useState([]);
	const [ bundles, setbundles ] = useState([]);
	const [ loadingsubmit, setloadingsubmit ] = React.useState(false);
	const [ loadingeditset, setloadingeditset ] = React.useState(false);
	const [ loadingdelete, setloadingdelete ] = React.useState({ status: false, id: '' });
	const [ open, setOpen ] = React.useState(false);
	// const [ openEdit, setOpenEdit ] = React.useState(false);
	const [ openError, setOpenError ] = React.useState({ status: false, message: '' });
	const [ openSuccess, setOpenSuccess ] = React.useState({ status: false, message: '' });
	// Get bundles
	useEffect(
		() => {
			if (managebundles && managebundles.managebundles) {
				// console.log(managebundles.managebundles);
				setbundles(managebundles.managebundles);
				setsearchedbundles(managebundles.managebundles);
			}
			// setbundload(false);
			// fetch('/bundles/names', {
			// 	method: 'get',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Authorization: 'Bearer ' + localStorage.getItem('jwt')
			// 	}
			// })
			// 	.then((res) => res.json())
			// 	.then((uss) => {
			// 		// console.log(uss)
			// 		setbundles(uss);
			// 		setsearchedbundles(uss);
			// 		setbundload(false);
			// 	})
			// 	.catch((err) => console.log(err));
		},
		[ managebundles ]
	);
	// redux state upadator
	useEffect(() => {
		if (manageads && !manageads.manageads) {
			dispatchRedux(loadingAds());
			dispatchRedux(loadAds());
		}
		if (managebundles && !managebundles.managebundles) {
			dispatchRedux(loadingBundles());
			dispatchRedux(loadBundles());
		}
	}, []);
	// Get Campaigns
	useEffect(
		() => {
			if (manageads && manageads.manageads) {
				// console.log(manageads.manageads);
				setcampaigns(manageads.manageads);
				setsearchedcampaigns(manageads.manageads);
				// setcampload(false);
			}
			// fetch('/streamingads/groupedMod1', {
			// 	method: 'get',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Authorization: 'Bearer ' + localStorage.getItem('jwt')
			// 	}
			// })
			// 	.then((res) => res.json())
			// 	.then((uss) => {
			// 		console.log(uss);
			// 		setcampaigns(uss);
			// 		setsearchedcampaigns(uss);
			// 		setcampload(false);
			// 		// campsep();
			// 	})
			// 	.catch((err) => console.log(err));
		},
		[ manageads ]
	);
	// updating User
	useEffect(
		() => {
			fetch(`/auth/id/${id}`, {
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt')
				}
			})
				.then((res) => res.json())
				.then((user) => {
					if (user) {
						console.log(user);
						setemail(user.email);
						setusername(user.username);
						setusertype(user.usertype);
						setloading(false);
						// setuser(user);
					}
				});
		},
		[ id ]
	);
	// updating selected campaigns and bundles
	useEffect(
		() => {
			fetch(`/auth/campaigns/${id}`, {
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt')
				}
			})
				.then((res) => res.json())
				.then((campa) => {
					if (campa) {
						console.log(campa);
						setselectedcampaigns(campa);
						// setemail(user.email);
						// setusername(user.username);
						// setusertype(user.usertype);
						// setloading(false);
						// setuser(user);
					}
				});
		},
		[ id ]
	);
	// to delete th coloumn in adding user
	function handledelete(x, su) {
		console.log(su);
		var temp = selectedsemicampaigns.titles;
		temp = temp.filter((y) => y.title != x);
		console.log(temp);
		setselectedsemicampaigns({ ...selectedsemicampaigns, titles: temp });
		console.log(selectedsemicampaigns);
		su.map((x) => {
			if (x === 'audio') setselectedsemicampaigns((prev) => ({ ...prev, audio: null }));
			if (x === 'display') setselectedsemicampaigns((prev) => ({ ...prev, display: null }));
			if (x === 'video') setselectedsemicampaigns((prev) => ({ ...prev, video: null }));
			if (x === 'musicapps') setselectedsemicampaigns((prev) => ({ ...prev, musicapps: null }));
			if (x === 'podcast') setselectedsemicampaigns((prev) => ({ ...prev, podcast: null }));
			if (x === 'onDemand') setselectedsemicampaigns((prev) => ({ ...prev, onDemand: null }));
		});
	}
	// to add the campagin to a user
	function handleAddCampagin() {
		var filled = false;
		const { audio, display, video, musicapps, podcast, onDemand } = selectedsemicampaigns;
		if (audio && display && video && musicapps && podcast && onDemand) {
			filled = true;
		}
		if (!filled) {
			console.log('error');
		}
		fetch('/auth/addCampaign', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				userid: id,
				searchName: selectedsemicampaigns.searchName,
				startDate: selectedsemicampaigns.startDate,
				endDate: selectedsemicampaigns.endDate,
				PricingModel: selectedsemicampaigns.PricingModel,
				type: selectedsemicampaigns.type,
				campaignName: selectedsemicampaigns.title,
				audio: selectedsemicampaigns.audio,
				display: selectedsemicampaigns.display,
				video: selectedsemicampaigns.video,
				musicapps: selectedsemicampaigns.musicapps,
				podcast: selectedsemicampaigns.podcast,
				onDemand: selectedsemicampaigns.onDemand
			})
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				if (result.error) {
					setloadingsubmit(false);
					return setOpenError({ status: true, message: result.error });
				}
				setOpenSuccess({ status: true, message: result.message });
				var sel = selectedcampaigns;
				sel.push(result.result);
				setselectedcampaigns(sel);
				setOpen(false);
				setloadingsubmit(false);
				setselectedsemicampaigns({
					_id: '',
					userid: '',
					title: '',
					searchName: '',
					adtitle: '',
					titles: [],
					type: '',
					endDate: null,
					startDate: null,
					PricingModel: null,
					audio: null,
					audio: null,
					display: null,
					video: null,
					musicapps: null,
					onDemand: null,
					podcast: null
				});
				settitlesadding({
					title: '',
					audio: false,
					display: false,
					musicapps: false,
					video: false,
					podcast: false,
					onDemand: false
				});
			})
			.catch((err) => console.log(err));
	}
	// to edit the campagin to a user
	function handleEditCampagin() {
		var filled = false;
		const { audio, display, video, musicapps, podcast, onDemand } = selectedsemicampaigns;
		if ((audio || (musicapps && podcast && onDemand)) && display && video) {
			filled = true;
		}
		if (!filled) {
			console.log('error');
		}
		fetch('/auth/editcampaign', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				_id: selectedsemicampaigns._id,
				userid: id,
				searchName: selectedsemicampaigns.searchName,
				startDate: selectedsemicampaigns.startDate,
				endDate: selectedsemicampaigns.endDate,
				PricingModel: selectedsemicampaigns.PricingModel,
				type: selectedsemicampaigns.type,
				campaignName: selectedsemicampaigns.title,
				audio: selectedsemicampaigns.audio,
				display: selectedsemicampaigns.display,
				video: selectedsemicampaigns.video,
				musicapps: selectedsemicampaigns.musicapps,
				podcast: selectedsemicampaigns.podcast,
				onDemand: selectedsemicampaigns.onDemand
			})
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				if (result.error) {
					setloadingsubmit(false);
					return setOpenError({ status: true, message: result.error });
				}
				setOpenSuccess({ status: true, message: result.message });
				var sel = selectedcampaigns.filter((x) => x._id != selectedsemicampaigns._id);
				sel.push(result.result);
				setselectedcampaigns(sel);
				setOpen(false);
				setloadingsubmit(false);
				setselectedsemicampaigns({
					_id: '',
					userid: '',
					title: '',
					searchName: '',
					adtitle: '',
					titles: [],
					type: '',
					endDate: null,
					startDate: null,
					PricingModel: null,
					audio: null,
					audio: null,
					display: null,
					video: null,
					musicapps: null,
					onDemand: null,
					podcast: null
				});
				settitlesadding({
					title: '',
					audio: false,
					display: false,
					musicapps: false,
					video: false,
					podcast: false,
					onDemand: false
				});
			})
			.catch((err) => console.log(err));
	}
	// to delete the campaign for a user
	function handeleDeleteCampagin(id) {
		console.log(id);
		if (!id) {
			return setOpenError({ status: true, message: 'Somthing went wrong try again' });
		}
		fetch('/auth/deletecampaign', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				id
			})
		})
			.then((res) => res.json())
			.then((result) => {
				setloadingdelete((prev) => ({ id: '', status: false }));
				if (result.error) {
					return setOpenError({ status: true, message: result.error });
				}
				setOpenSuccess({ status: true, message: result.message });
				var del = selectedcampaigns;
				del = del.filter((x) => x._id != id);
				setselectedcampaigns(del);
				console.log(del);
			});
	}
	// to setup the edit data
	function handleEditSetUp(camp) {
		console.log(camp);
		var titlesH = [];
		var titlesF = [];
		var data = {
			_id: '',
			userid: '',
			submitType: 'edit',
			title: '',
			searchName: '',
			adtitle: '',
			titles: [],
			type: '',
			endDate: null,
			startDate: null,
			PricingModel: null,
			audio: null,
			audio: null,
			display: null,
			video: null,
			musicapps: null,
			onDemand: null,
			podcast: null
		};
		for (const [ y, z ] of Object.entries(camp)) {
			// console.log(y, z);
			if (y === 'campaignName') {
				data['title'] = camp[y];
				data.adtitle = z;
			} else if (y === '__v') {
			} else {
				data[y] = camp[y];
			}
			if (
				y == 'audio' ||
				y == 'display' ||
				y == 'video' ||
				y == 'musicapps' ||
				y == 'podcast' ||
				y == 'onDemand'
			) {
				titlesH.push(z);
			}
		}
		titlesH = [ ...new Set(titlesH) ];
		titlesH.map((x) => {
			if (x != undefined || x != null) {
				console.log(x);
				var temp = {
					title: '',
					audio: false,
					display: false,
					musicapps: false,
					video: false,
					podcast: false,
					onDemand: false
				};
				temp.title = x;
				if (camp.audio === x) temp.audio = true;
				if (camp.display === x) temp.display = true;
				if (camp.video === x) temp.video = true;
				if (camp.musicapps === x) temp.musicapps = true;
				if (camp.podcast === x) temp.podcast = true;
				if (camp.onDemand === x) temp.onDemand = true;
				titlesF.push(temp);
			}
		});
		data.titles = titlesF;
		console.log(data, titlesH, titlesF);
		setselectedsemicampaigns(data);
	}
	if (loading || managebundles.isLoading || manageads.isLoading) {
		return <PreLoader />;
	}
	return (
		<div>
			<Paper style={{ width: 'fit-content', padding: '30px', margin: '30px auto', display: 'flex' }}>
				{loading ? (
					<CircularProgress style={{ width: 'fit-content', margin: '0px auto' }} />
				) : (
					<div className="edituser">
						<h5>Editing - {username}</h5>
						<Snackbar
							open={openError.status}
							anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
							key={'top' + 'right' + 'error'}
							autoHideDuration={6000}
							onClose={() => setOpenError((prev) => ({ ...prev, status: false }))}
						>
							<Alert
								onClose={() => setOpenError((prev) => ({ ...prev, status: false }))}
								severity="error"
							>
								{openError.message}
							</Alert>
						</Snackbar>
						<Snackbar
							open={openSuccess.status}
							autoHideDuration={6000}
							anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
							key={'top' + 'right' + 'success'}
							onClose={() => setOpenSuccess((prev) => ({ ...prev, status: false }))}
						>
							<Alert
								onClose={() => setOpenSuccess((prev) => ({ ...prev, status: false }))}
								severity="success"
							>
								{openSuccess.message}
							</Alert>
						</Snackbar>
						<div className="ineditables">
							<input
								placeholder="Username"
								required
								value={username}
								className="editineditinput"
								disabled
								// onChange={(e) => setusername(e.target.value)}
							/>
							<FormControl variant="outlined" className="editineditinput">
								<InputLabel htmlFor="outlined-age-native-simple">User Type</InputLabel>
								<Select
									required
									native
									value={usertype}
									disabled
									// onChange={(e) => setusertype(e.target.value)}
									label="USe Type"
								>
									<option arial-label="None" value="" />
									<option value="admin">Admin</option>
									<option value="client">Client</option>
								</Select>
							</FormControl>
							<input placeholder="Email" className="editineditinput" required value={email} disabled />
						</div>
						{selectedcampaigns && selectedcampaigns.length > 0 ? (
							<div>
								<b>selected campagins</b>
								<Table className="selectedcamp">
									<TableHead>
										<TableRow>
											<TableCell id="cellselect" align="center">
												Title
											</TableCell>
											<TableCell id="cellselect" align="center">
												Type
											</TableCell>
											<TableCell id="cellselect" align="center">
												Pricing Model
											</TableCell>
											<TableCell id="cellselect" />
											<TableCell id="cellselect" />
										</TableRow>
									</TableHead>
									<TableBody>
										{selectedcampaigns.map((x, i) => {
											return (
												<TableRow key={i}>
													<TableCell id="cellselect" align="center">
														{x.campaignName}
													</TableCell>
													<TableCell id="cellselect" align="center">
														{x.type}
													</TableCell>
													<TableCell id="cellselect" align="center">
														{x.PricingModel}
													</TableCell>
													<TableCell id="cellselect" align="right">
														<IconButton
															aria-label="edit"
															onClick={() => {
																setOpen(true);
																handleEditSetUp(x);
															}}
														>
															<EditIcon />
														</IconButton>
													</TableCell>
													<TableCell
														id="cellselect"
														align="right"
														className="selectedcampval"
														onClick={() => {
															setloadingdelete({ status: true, id: x._id });
															handeleDeleteCampagin(x._id);
														}}
													>
														{loadingdelete.id === x._id && loadingdelete.status ? (
															<CircularProgress />
														) : (
															<IconButton aria-label="delete">
																<DeleteIcon />
															</IconButton>
														)}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						) : (
							''
						)}
						<div className="bothlist">
							<div className="listcomp">
								<Input
									placeholder="search campaigns"
									onChange={(e) => {
										var campaignsdata = campaigns.filter((x) =>
											x.Adtitle.toLowerCase().includes(e.target.value.toLowerCase())
										);
										setsearchedcampaigns(campaignsdata);
									}}
								/>
								<div className="List">
									{searchedcampaigns.map((camp, i) => {
										return (
											<div
												key={i}
												className="ListItem"
												onClick={() => {
													setselectedsemicampaigns({
														...selectedsemicampaigns,
														searchName: camp.Adtitle,
														adtitle: camp.Adtitle,
														title: camp.Adtitle,
														type: 'campaign',
														submitType: 'create',
														PricingModel: camp.PricingModel,
														endDate: camp.endDate,
														startDate: camp.startDate
													});
													setOpen(true);
												}}
											>
												{camp.Adtitle}
											</div>
										);
									})}
								</div>
							</div>
							<div className="listcomp">
								<Input
									placeholder="search Bundles"
									onChange={(e) => {
										var campaignsdata = bundles.filter((x) =>
											x.bundleadtitle.toLowerCase().includes(e.target.value.toLowerCase())
										);
										setsearchedbundles(campaignsdata);
									}}
								/>
								<div className="List">
									{searchedbundles.map((camp, i) => {
										return (
											<div
												key={i}
												className="ListItem"
												onClick={() => {
													setselectedsemicampaigns({
														...selectedsemicampaigns,
														adtitle: camp.bundleadtitle,
														title: camp.bundleadtitle,
														searchName: camp._id,
														type: 'bundle',
														submitType: 'create',
														PricingModel: camp.PricingModel,
														endDate: camp.endDate,
														startDate: camp.startDate
													});
													setOpen(true);
												}}
											>
												{camp.bundleadtitle}
											</div>
										);
									})}
								</div>
							</div>
						</div>
						<Modal
							open={open}
							onClose={() => {
								setOpen(false);
								setselectedsemicampaigns({
									_id: '',
									submitType: '',
									userid: '',
									title: '',
									searchName: '',
									adtitle: '',
									titles: [],
									type: '',
									endDate: null,
									startDate: null,
									PricingModel: null,
									audio: null,
									audio: null,
									display: null,
									video: null,
									musicapps: null,
									onDemand: null,
									podcast: null
								});
							}}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description"
						>
							<Paper style={modalStyle}>
								<b>
									{selectedsemicampaigns && selectedsemicampaigns.submitType === 'create' ? (
										selectedsemicampaigns.adtitle
									) : (
										selectedsemicampaigns.title
									)}
								</b>
								<div className="editcamptitledis">
									<div className="liscomp">
										<div>Title to be displayed :</div>
										<input
											placeholder="Campaign or bundle title"
											required
											className="titleing"
											value={selectedsemicampaigns.title}
											onChange={(e) =>
												setselectedsemicampaigns({
													...selectedsemicampaigns,
													title: e.target.value
												})}
										/>
									</div>
								</div>
								<div>
									{selectedsemicampaigns.titles && selectedsemicampaigns.titles.length ? (
										<div>
											<Table>
												<TableHead>
													<TableRow>
														<TableCell align="center">Title</TableCell>
														<TableCell align="center">values</TableCell>
														<TableCell align="center" />
													</TableRow>
												</TableHead>
												<TableBody>
													{selectedsemicampaigns.titles.map((x, i) => {
														var su = [];
														x.audio && su.push('audio');
														x.display && su.push('display');
														x.video && su.push('video');
														x.musicapps && su.push('musicapps');
														x.podcast && su.push('podcast');
														x.onDemand && su.push('onDemand');
														return (
															<TableRow key={i} className="semiselectcont">
																<TableCell align="center" className="semiselecttit">
																	{x.title}
																</TableCell>
																<TableCell align="center" className="semiselectval">
																	{su.map((x) => x + ' ,')}
																</TableCell>
																<TableCell
																	style={{ cursor: 'pointer' }}
																	align="center"
																	onClick={() => handledelete(x.title, su)}
																>
																	<DeleteIcon />
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										</div>
									) : (
										''
									)}
								</div>
								<div>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											var temp = selectedsemicampaigns;
											var datacheck = temp.titles.filter(
												(x) => x.title.toLowerCase() === titlesadding.title.toLowerCase()
											);
											console.log(datacheck);
											if (datacheck.length === 0) {
												settexterror(false);
												temp.titles.push(titlesadding);
												if (titlesadding.audio) temp.audio = titlesadding.title;
												if (titlesadding.display) temp.display = titlesadding.title;
												if (titlesadding.video) temp.video = titlesadding.title;
												if (titlesadding.musicapps) temp.musicapps = titlesadding.title;
												if (titlesadding.podcast) temp.podcast = titlesadding.title;
												if (titlesadding.onDemand) temp.onDemand = titlesadding.title;
												setselectedsemicampaigns(temp);
												settitlesadding({
													title: '',
													audio: false,
													display: false,
													musicapps: false,
													video: false,
													podcast: false,
													onDemand: false
												});
												console.log(temp);
											} else {
												settexterror(true);
											}
										}}
									>
										<input
											placeholder="Title"
											required
											className="titleing"
											value={titlesadding.title}
											onChange={(e) =>
												settitlesadding({ ...titlesadding, title: e.target.value })}
										/>
										<FormControl error={texterror} component="fieldset">
											<FormLabel component="legend">Managing Merge</FormLabel>
											<FormGroup className="options">
												<FormControlLabel
													disabled={
														selectedsemicampaigns.audio ||
														selectedsemicampaigns.musicapps ||
														selectedsemicampaigns.podcast ||
														selectedsemicampaigns.onDemand ? (
															true
														) : (
															false
														)
													}
													control={
														<Checkbox
															checked={titlesadding.audio}
															onChange={(e) =>
																settitlesadding({
																	...titlesadding,
																	audio: e.target.checked,
																	musicapps: e.target.checked,
																	podcast: e.target.checked,
																	onDemand: e.target.checked
																})}
															name="audio"
															color="primary"
														/>
													}
													label="Audio"
												/>
												<FormControlLabel
													disabled={
														selectedsemicampaigns.audio ||
														selectedsemicampaigns.musicapps ? (
															true
														) : (
															false
														)
													}
													control={
														<Checkbox
															checked={titlesadding.musicapps}
															onChange={(e) =>
																settitlesadding({
																	...titlesadding,
																	musicapps: e.target.checked
																})}
															name="musicapps"
															color="primary"
														/>
													}
													label="Musicapps(Audio)"
												/>
												<FormControlLabel
													disabled={
														selectedsemicampaigns.audio || selectedsemicampaigns.podcast ? (
															true
														) : (
															false
														)
													}
													control={
														<Checkbox
															checked={titlesadding.podcast}
															onChange={(e) =>
																settitlesadding({
																	...titlesadding,
																	podcast: e.target.checked
																})}
															name="podcast"
															color="primary"
														/>
													}
													label="Podcast(Audio)"
												/>
												<FormControlLabel
													disabled={
														selectedsemicampaigns.audio ||
														selectedsemicampaigns.onDemand ? (
															true
														) : (
															false
														)
													}
													control={
														<Checkbox
															checked={titlesadding.onDemand}
															onChange={(e) =>
																settitlesadding({
																	...titlesadding,
																	onDemand: e.target.checked
																})}
															name="onDemand"
															color="primary"
														/>
													}
													label="onDemand(Audio)"
												/>
												<FormControlLabel
													disabled={selectedsemicampaigns.display ? true : false}
													control={
														<Checkbox
															checked={titlesadding.display}
															onChange={(e) =>
																settitlesadding({
																	...titlesadding,
																	display: e.target.checked
																})}
															name="display"
															color="primary"
														/>
													}
													label="Display"
												/>
												<FormControlLabel
													disabled={selectedsemicampaigns.video ? true : false}
													control={
														<Checkbox
															checked={titlesadding.video}
															onChange={(e) =>
																settitlesadding({
																	...titlesadding,
																	video: e.target.checked
																})}
															name="video"
															color="primary"
														/>
													}
													label="Video"
												/>
											</FormGroup>
											<FormHelperText>{texterror ? 'Enter the unique title' : ''}</FormHelperText>
										</FormControl>
										<Button className="button" variant="contained" color="secondary" type="submit">
											Add
										</Button>
									</form>
									{!loadingsubmit ? (
										<Button
											color="secondary"
											variant="contained"
											onClick={() => {
												setloadingsubmit(true);
												if (selectedsemicampaigns.submitType === 'create') handleAddCampagin();
												else handleEditCampagin();
											}}
										>
											{selectedsemicampaigns.submitType === 'create' ? (
												'Add Campaign'
											) : (
												'Update Campaign'
											)}
										</Button>
									) : (
										<CircularProgress />
									)}
								</div>
							</Paper>
						</Modal>
						{/* <Button type="submit" color="primary" variant="contained">
							Update User
						</Button> */}
					</div>
				)}
			</Paper>
		</div>
	);
}

export default EditUser;

// function bunsep() {
// 	if (user) {
// 		var exsitselect = user.bundles ? user.bundles : [];
// 		var current = bundles;
// 		// console.log(user.bundles, bundles);
// 		var dunk = [];
// 		var undunk = [];
// 		exsitselect.map((x) => {
// 			current.map((y) => {
// 				if (x === y._id.toString()) {
// 					dunk.push(y);
// 				}
// 			});
// 		});
// 		undunk = current.filter((x) => !dunk.includes(x));
// 		setselectedbundles(dunk);
// 		setbundles(undunk);
// 		setsearchedbundles(undunk);
// 		setcomploadb(false);
// 	}
// }
// function campsep() {
// 	if (user) {
// 		var exsitselect = user.campaigns ? user.campaigns : [];
// 		var current = campaigns;
// 		var dunk = [];
// 		var undunk = [];
// 		console.log(current);
// 		exsitselect.map((x) => {
// 			current.map((y) => {
// 				if (x === y._id.toString()) dunk.push(y);
// 			});
// 		});
// 		undunk = current.filter((x) => !dunk.includes(x));
// 		// console.log(dunk, undunk);
// 		setselectedcampaigns(dunk);
// 		setcampaigns(undunk);
// 		setsearchedcampaigns(undunk);
// 		// console.log(user.campaigns, campaigns);
// 		setcomploadc(false);
// 	}
// }
// useEffect(
// 	() => {
// 		if (comploadb) bunsep();
// 	},
// 	[ user, bundles ]
// );
// useEffect(
// 	() => {
// 		if (comploadc) campsep();
// 	},
// 	[ user, campaigns ]
// );
// load Updator
// useEffect(
// 	() => {
// 		console.log('0');
// 		if (user || loading || bundload || campload) {
// 			console.log('2');
// 			setcompload(true);
// 		}
// 	},
// 	[ user, loading, bundload, campload ]
// );
// updating campaigns and bundles
// useEffect(
// 	() => {
// 		if (user && compload) {
// 			console.log(user.bundles);
// 			console.log(user.campaigns);
// 			console.log(campaigns);
// 			console.log(bundles);
// 			var selectedBundlesList = [];
// 			bundles.map((x) => {
// 				user.bundles &&
// 					user.bundles.map((xa) => {
// 						console.log(x, xa);
// 					});
// 			});
// 			console.log(selectedBundlesList);
// 		}
// 	},
// 	[ compload ]
// );
// Edit User
// function createUser() {
// 	var bundleids = selectedbundles.map((bundle) => {
// 		return bundle._id;
// 	});
// 	var campids = selectedcampaigns.map((camp) => {
// 		return camp._id;
// 	});
// 	fetch('/auth/addbundleOrcampaigns', {
// 		method: 'put',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 		},
// 		body: JSON.stringify({
// 			id: user._id,
// 			bundles: bundleids,
// 			campaigns: campids
// 		})
// 	})
// 		.then((res) => res.json())
// 		.then((result) => {
// 			if (result.error) {
// 				console.log(result);
// 				M.toast({ html: result.error, classes: '#ff5252 red accent-2' });
// 			} else {
// 				M.toast({ html: result.message, classes: '#69f0ae green accent-2' });
// 				setemail('');
// 				setusertype('');
// 				setusername('');
// 				var campsel = selectedcampaigns;
// 				var bundsel = selectedbundles;
// 				var bundlen = bundles;
// 				var campn = campaigns;
// 				bundlen.concat(bundsel);
// 				campn.concat(campsel);
// 				setselectedbundles([]);
// 				setselectedcampaigns([]);
// 				setcampaigns(campn);
// 				setbundles(bundlen);
// 				history.push('/manageusers');
// 			}
// 		})
// 		.catch((err) => console.log(err));
// }

// {/* onChange={(e) => setemail(e.target.value)}  */}
// <div className="title">Selected Bundles</div>
// <div className="selectedList">
// 	{selectedbundles.map((bundle, i) => {
// 		return (
// 			<div key={i} className="selectedListItem">
// 				{bundle.bundleadtitle}
// 				<CancelIcon
// 					style={{ cursor: 'pointer' }}
// 					onClick={() => {
// 						var selectedbundlelist = selectedbundles.filter(
// 							(x) => x.bundleadtitle !== bundle.bundleadtitle
// 						);
// 						var searchedbundlesnew = searchedbundles;
// 						var bundlesnew = bundles;
// 						searchedbundlesnew.push(bundle);
// 						bundlesnew.push(bundle);
// 						setselectedbundles(selectedbundlelist);
// 						setsearchedbundles(searchedbundlesnew);
// 						setbundles(bundlesnew);
// 					}}
// 				/>
// 			</div>
// 		);
// 	})}
// </div>
// <Input
// 	placeholder="search bundles"
// 	onChange={(e) => {
// 		var bundlesdata = bundles.filter((x) =>
// 			x.bundleadtitle.toLowerCase().includes(e.target.value.toLowerCase())
// 		);
// 		setsearchedbundles(bundlesdata);
// 	}}
// />
// <div className="List">
// 	{searchedbundles.map((bundle, i) => {
// 		return (
// 			<div
// 				key={i}
// 				className="ListItem"
// 				onClick={() => {
// 					var bundlesnew = bundles.filter(
// 						(x) => x.bundleadtitle !== bundle.bundleadtitle
// 					);
// 					var searchedbundlesnew = searchedbundles.filter(
// 						(x) => x.bundleadtitle !== bundle.bundleadtitle
// 					);
// 					var selectedbun = selectedbundles;
// 					selectedbun.push(bundle);
// 					setselectedbundles(selectedbun);
// 					setsearchedbundles(searchedbundlesnew);
// 					setbundles(bundlesnew);
// 				}}
// 			>
// 				{bundle.bundleadtitle}
// 			</div>
// 		);
// 	})}
// </div>
// <div className="title">Selected Campaigns</div>
// <div className="selectedList">
// 	{selectedcampaigns.map((camp, i) => {
// 		return (
// 			<div key={i} className="selectedListItem">
// 				{camp.AdTitle}
// 				<CancelIcon
// 					style={{ cursor: 'pointer' }}
// 					onClick={() => {
// 						var selectedcampaignlist = selectedcampaigns.filter(
// 							(x) => x.AdTitle !== camp.AdTitle
// 						);
// 						var searchedcampaignsnew = searchedcampaigns;
// 						var campaignsnew = campaigns;
// 						searchedcampaignsnew.push(camp);
// 						campaignsnew.push(camp);
// 						setselectedcampaigns(selectedcampaignlist);
// 						setsearchedcampaigns(searchedcampaignsnew);
// 						setcampaigns(campaignsnew);
// 					}}
// 				/>
// 			</div>
// 		);
// 	})}
// </div>
// <Input
// 	placeholder="search campaigns"
// 	onChange={(e) => {
// 		var campaignsdata = campaigns.filter((x) =>
// 			x.AdTitle.toLowerCase().includes(e.target.value.toLowerCase())
// 		);
// 		setsearchedcampaigns(campaignsdata);
// 	}}
// />
// <div className="List">
// 	{searchedcampaigns.map((camp, i) => {
// 		return (
// 			<div
// 				key={i}
// 				className="ListItem"
// 				onClick={() => {
// 					var campaignsnew = campaigns.filter((x) => x.AdTitle !== camp.AdTitle);
// 					var searchedcampaignsnew = searchedcampaigns.filter(
// 						(x) => x.AdTitle !== camp.AdTitle
// 					);
// 					var selectedcamp = selectedcampaigns;
// 					selectedcamp.push(camp);
// 					setselectedcampaigns(selectedcamp);
// 					setsearchedcampaigns(searchedcampaignsnew);
// 					setcampaigns(campaignsnew);
// 				}}
// 			>
// 				{camp.AdTitle}
// 			</div>
// 		);
// 	})}
// </div>
