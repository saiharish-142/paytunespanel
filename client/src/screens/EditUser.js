import { Button, CircularProgress, FormControl, Input, InputLabel, Paper, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
// import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
// import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import M from 'materialize-css';
import { useHistory, useParams } from 'react-router-dom';
import PreLoader from '../components/loaders/PreLoader';

function EditUser() {
	const { id } = useParams();
	const history = useHistory();
	const [ email, setemail ] = useState('');
	const [ usertype, setusertype ] = useState('');
	const [ username, setusername ] = useState('');
	const [ loading, setloading ] = useState(true);
	const [ campload, setcampload ] = useState(true);
	const [ bundload, setbundload ] = useState(true);
	const [ comploadb, setcomploadb ] = useState(true);
	const [ comploadc, setcomploadc ] = useState(true);
	const [ user, setuser ] = useState(null);
	const [ selectedcampaigns, setselectedcampaigns ] = useState([]);
	const [ searchedcampaigns, setsearchedcampaigns ] = useState([]);
	const [ campaigns, setcampaigns ] = useState([]);
	const [ selectedbundles, setselectedbundles ] = useState([]);
	const [ searchedbundles, setsearchedbundles ] = useState([]);
	const [ bundles, setbundles ] = useState([]);
	// Get bundles
	useEffect(() => {
		fetch('/bundles/names', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((uss) => {
				// console.log(uss)
				setbundles(uss);
				setsearchedbundles(uss);
				setbundload(false);
			})
			.catch((err) => console.log(err));
	}, []);
	// Get Campaigns
	useEffect(() => {
		fetch('/streamingads/names', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((uss) => {
				// console.log(uss)
				setcampaigns(uss);
				setsearchedcampaigns(uss);
				setcampload(false);
				campsep();
			})
			.catch((err) => console.log(err));
	}, []);
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
						setuser(user);
					}
				});
		},
		[ id ]
	);
	function bunsep() {
		if (user) {
			var exsitselect = user.bundles;
			var current = bundles;
			// console.log(user.bundles, bundles);
			var dunk = [];
			exsitselect.map((x) => {
				current.map((y) => {
					if (x === y._id.toString()) dunk.push(y);
				});
			});
			setselectedbundles(dunk);
			setcomploadb(false);
		}
	}
	function campsep() {
		if (user) {
			var exsitselect = user.campaigns;
			var current = campaigns;
			var dunk = [];
			// console.log(user.bundles, bundles);
			exsitselect.map((x) => {
				current.map((y) => {
					if (x === y._id.toString()) dunk.push(y);
				});
			});
			console.log(dunk);
			setselectedcampaigns(dunk);
			// console.log(user.campaigns, campaigns);
			setcomploadc(false);
		}
	}
	useEffect(
		() => {
			if (comploadb) bunsep();
		},
		[ user, bundles ]
	);
	useEffect(
		() => {
			if (comploadc) campsep();
		},
		[ user, campaigns ]
	);
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
	function createUser() {
		var bundleids = selectedbundles.map((bundle) => {
			return bundle._id;
		});
		var campids = selectedcampaigns.map((camp) => {
			return camp._id;
		});
		fetch('/auth/addbundleOrcampaigns', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				username,
				email,
				usertype,
				bundles: bundleids,
				campaigns: campids
			})
		})
			.then((res) => res.json())
			.then((result) => {
				if (result.error) {
					M.toast({ html: result.error, classes: '#ff5252 red accent-2' });
				} else {
					M.toast({ html: result.message, classes: '#69f0ae green accent-2' });
					setemail('');
					setusertype('');
					setusername('');
					var campsel = selectedcampaigns;
					var bundsel = selectedbundles;
					var bundlen = bundles;
					var campn = campaigns;
					bundlen.concat(bundsel);
					campn.concat(campsel);
					setselectedbundles([]);
					setselectedcampaigns([]);
					setcampaigns(campn);
					setbundles(bundlen);
					history.push('/manageusers');
				}
			})
			.catch((err) => console.log(err));
	}
	if (loading || bundload || campload) {
		return <PreLoader />;
	}
	return (
		<div>
			<Paper style={{ width: '40%', padding: '30px', margin: '30px auto', display: 'flex' }}>
				{loading ? (
					<CircularProgress style={{ width: 'fit-content', margin: '0px auto' }} />
				) : (
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
							disabled
							// onChange={(e) => setusername(e.target.value)}
						/>
						<FormControl variant="outlined" style={{ minWidth: '100%' }}>
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
						{/* onChange={(e) => setemail(e.target.value)}  */}
						<input placeholder="Email" required value={email} disabled />
						<div className="title">Selected Bundles</div>
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
										{camp.AdTitle}
									</div>
								);
							})}
						</div>
						<Button type="submit" color="primary" variant="contained">
							Create User
						</Button>
					</form>
				)}
			</Paper>
		</div>
	);
}

export default EditUser;
