import {
	Button,
	FormControl,
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
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditIcon from '@material-ui/icons/Edit';
// import CancelIcon from '@material-ui/icons/Cancel';
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';

function ManageUser() {
	const history = useHistory();
	const [ email, setemail ] = useState('');
	const [ password, setpassword ] = useState('');
	const [ usertype, setusertype ] = useState('');
	const [ username, setusername ] = useState('');
	const [ users, setusers ] = useState([]);
	// const [ selectedcampaigns, setselectedcampaigns ] = useState([]);
	// const [ searchedcampaigns, setsearchedcampaigns ] = useState([]);
	// const [ campaigns, setcampaigns ] = useState([]);
	// const [ selectedbundles, setselectedbundles ] = useState([]);
	// const [ searchedbundles, setsearchedbundles ] = useState([]);
	// const [ bundles, setbundles ] = useState([]);
	// Get users
	useEffect(() => {
		fetch('/auth/users', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((uss) => {
				console.log(uss);
				setusers(uss);
			})
			.catch((err) => console.log(err));
	}, []);
	// Get bundles
	// useEffect(() => {
	// 	fetch('/bundles/names', {
	// 		method: 'get',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		}
	// 	})
	// 		.then((res) => res.json())
	// 		.then((uss) => {
	// 			// console.log(uss)
	// 			setbundles(uss);
	// 			setsearchedbundles(uss);
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);
	// Get Campaigns
	// useEffect(() => {
	// 	fetch('/streamingads/groupedMangename', {
	// 		method: 'get',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		}
	// 	})
	// 		.then((res) => res.json())
	// 		.then((uss) => {
	// 			console.log(uss);
	// 			setcampaigns(uss);
	// 			setsearchedcampaigns(uss);
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);
	useEffect(
		() => {
			console.log('users updated');
		},
		[ users ]
	);
	function createUser() {
		// var bundleids = selectedbundles.map((bundle) => {
		// 	return bundle._id;
		// });
		// var campids = selectedcampaigns.map((camp) => {
		// 	return camp._id;
		// });
		fetch('/auth/createUser', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				username,
				password,
				email,
				usertype
			})
		})
			.then((res) => res.json())
			.then((result) => {
				if (result.error) {
					M.toast({ html: result.error, classes: '#ff5252 red accent-2' });
				} else {
					var data = users;
					data.push({ _id: result._id, username: username, usertype: usertype, email: email });
					// console.log(data)
					M.toast({ html: result.message, classes: '#69f0ae green accent-2' });
					setusers(data);
					setemail('');
					setpassword('');
					setusertype('');
					setusername('');
					history.push('/manageusers');
					// window.location.reload();
					// var campsel = selectedcampaigns;
					// var bundsel = selectedbundles;
					// var bundlen = bundles;
					// var campn = campaigns;
					// bundlen.concat(bundsel);
					// campn.concat(campsel);
					// setselectedbundles([]);
					// setselectedcampaigns([]);
					// setcampaigns(campn);
					// setbundles(bundlen);
				}
			})
			.catch((err) => console.log(err));
	}
	function deleteUSer(susername) {
		// console.log(susername)
		fetch('/auth/deleteUser', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				username: susername
			})
		})
			.then((res) => res.json())
			.then((result) => {
				var data = users;
				data = data.filter((x) => x.username !== susername);
				M.toast({ html: result.message, classes: '#69f0ae green accent-2' });
				setusers(data);
			})
			.catch((err) => console.log(err));
	}
	return (
		<React.Fragment>
			<Paper style={{ width: '40%', padding: '30px', margin: '30px auto', display: 'flex' }}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						// console.log(usertype,username,password)
						createUser();
					}}
				>
					<h5>Create a User</h5>
					<input
						placeholder="Username"
						required
						value={username}
						onChange={(e) => setusername(e.target.value)}
					/>
					<FormControl variant="outlined" style={{ minWidth: '100%' }}>
						<InputLabel htmlFor="outlined-age-native-simple">User Type</InputLabel>
						<Select
							required
							native
							value={usertype}
							onChange={(e) => setusertype(e.target.value)}
							label="USe Type"
						>
							<option arial-label="None" value="" />
							<option value="admin">Admin</option>
							<option value="client">Client</option>
						</Select>
					</FormControl>
					<input placeholder="Email" required value={email} onChange={(e) => setemail(e.target.value)} />
					<input
						type="password"
						placeholder="Password"
						required
						value={password}
						onChange={(e) => setpassword(e.target.value)}
					/>
					<Button type="submit" color="primary" variant="contained">
						Create User
					</Button>
				</form>
			</Paper>
			<Paper style={{ width: '50%', margin: '0 auto 20px auto', padding: '20px' }}>
				<b style={{ fontSize: '20px' }}>Users List</b>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="center">Username</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">User Type</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users &&
							users.map((data, i) => {
								return (
									<TableRow key={i}>
										<TableCell align="center">{data.username}</TableCell>
										<TableCell align="center">{data.email}</TableCell>
										<TableCell align="center">{data.usertype}</TableCell>
										{data.usertype !== 'admin' && (
											<TableCell
												align="center"
												onClick={() => deleteUSer(data.username)}
												style={{ cursor: 'pointer' }}
											>
												<DeleteOutlinedIcon />
											</TableCell>
										)}
										{data.usertype !== 'admin' && (
											<TableCell
												align="center"
												onClick={() => history.push(`/EditUser/${data._id}`)}
												style={{ cursor: 'pointer' }}
											>
												<EditIcon />
											</TableCell>
										)}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</Paper>
		</React.Fragment>
	);
}

export default ManageUser;

{
	/* <div className="title">Selected Bundles</div>
					<div className="selectedList">
						{selectedbundles.map((bundle, i) => {
							return (
								<div key={i} className="selectedListItem">
									{bundle.bundleadtitle}
									<CancelIcon
										style={{ cursor: 'pointer' }}
										onClick={() => {
											var selectedbundlelist = selectedbundles.filter(
												(x) => x.bundleadtitle !== bundle.bundleadtitle
											);
											var searchedbundlesnew = searchedbundles;
											var bundlesnew = bundles;
											searchedbundlesnew.push(bundle);
											bundlesnew.push(bundle);
											setselectedbundles(selectedbundlelist);
											setsearchedbundles(searchedbundlesnew);
											setbundles(bundlesnew);
										}}
									/>
								</div>
							);
						})}
					</div>
					<Input
						placeholder="search bundles"
						onChange={(e) => {
							var bundlesdata = bundles.filter((x) =>
								x.bundleadtitle.toLowerCase().includes(e.target.value.toLowerCase())
							);
							setsearchedbundles(bundlesdata);
						}}
					/>
					<div className="List">
						{searchedbundles.map((bundle, i) => {
							return (
								<div
									key={i}
									className="ListItem"
									onClick={() => {
										var bundlesnew = bundles.filter(
											(x) => x.bundleadtitle !== bundle.bundleadtitle
										);
										var searchedbundlesnew = searchedbundles.filter(
											(x) => x.bundleadtitle !== bundle.bundleadtitle
										);
										var selectedbun = selectedbundles;
										selectedbun.push(bundle);
										setselectedbundles(selectedbun);
										setsearchedbundles(searchedbundlesnew);
										setbundles(bundlesnew);
									}}
								>
									{bundle.bundleadtitle}
								</div>
							);
						})}
					</div>
					<div className="title">Selected Campaigns</div>
					<div className="selectedList">
						{selectedcampaigns.map((camp, i) => {
							return (
								<div key={i} className="selectedListItem">
									{camp.AdTitle}
									<CancelIcon
										style={{ cursor: 'pointer' }}
										onClick={() => {
											var selectedcampaignlist = selectedcampaigns.filter(
												(x) => x.AdTitle !== camp.AdTitle
											);
											var searchedcampaignsnew = searchedcampaigns;
											var campaignsnew = campaigns;
											searchedcampaignsnew.push(camp);
											campaignsnew.push(camp);
											setselectedcampaigns(selectedcampaignlist);
											setsearchedcampaigns(searchedcampaignsnew);
											setcampaigns(campaignsnew);
										}}
									/>
								</div>
							);
						})}
					</div>
					<Input
						placeholder="search campaigns"
						onChange={(e) => {
							var campaignsdata = campaigns.filter((x) =>
								x.AdTitle.toLowerCase().includes(e.target.value.toLowerCase())
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
										var campaignsnew = campaigns.filter((x) => x.AdTitle !== camp.AdTitle);
										var searchedcampaignsnew = searchedcampaigns.filter(
											(x) => x.AdTitle !== camp.AdTitle
										);
										var selectedcamp = selectedcampaigns;
										selectedcamp.push(camp);
										setselectedcampaigns(selectedcamp);
										setsearchedcampaigns(searchedcampaignsnew);
										setcampaigns(campaignsnew);
									}}
								>
									{camp.Adtitle}
								</div>
							);
						})}
					</div> */
}
