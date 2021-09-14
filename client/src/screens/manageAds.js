import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom'
import SearchCampagin from '../components/SearchCampagin';
import { useDispatch, useSelector } from 'react-redux';
import {
	loadingAds,
	ClientloadingAds,
	loadAds,
	loadClientAds,
	loadClientAAds,
	searchclientads,
	searchads,
	clientorderManager,
	orderManager,
	clientstorepagination,
	storepagination
} from '../redux/actions/manageadsAction';
import PreLoader from '../components/loaders/PreLoader';
import SortPaTable from '../components/SortPaTable';
import { useHistory } from 'react-router-dom';
// import { orderManager } from '../redux/actions/manageadsAction';

function Dashboard({ clientview, clientdirect }) {
	const history = useHistory();
	const dispatchRedux = useDispatch();
	const dataT = new URLSearchParams(window.location.search).get('red');
	const manageads = useSelector((state) => state.manageads);
	const clientmanageads = useSelector((state) => state.clientmanageads);
	const user = useSelector((state) => state.auth);
	const [ searchval, setSearchval ] = useState('');
	const [ statechecker ] = useState(clientview || clientdirect);
	// console.log(dataT);
	if (dataT) {
		if (clientview) {
			history.push('/?red=client');
		} else {
			history.push('/?red=manage');
		}
	}
	useEffect(
		() => {
			// console.log(clientview || clientdirect);
			// console.log(clientmanageads);
			if (clientview || clientdirect) {
				// console.log(clientmanageads.manageads);
				if (clientmanageads && !clientmanageads.manageads) {
					// alert('crazy');
					dispatchRedux(ClientloadingAds());
					clientdirect && dispatchRedux(loadClientAds());
					clientview && dispatchRedux(loadClientAAds());
				}
				if (clientmanageads && clientmanageads.value) {
					setSearchval(clientmanageads.value);
				}
			} else {
				console.log(manageads.manageads);
				if (manageads && !manageads.manageads) {
					// alert('crazy');
					dispatchRedux(loadingAds());
					dispatchRedux(loadAds());
				}
				if (manageads && manageads.value) {
					setSearchval(manageads.value);
				}
			}
		},
		[ statechecker ]
	);
	const onChangeRedux = (val) => {
		dispatchRedux(searchads(val));
		setSearchval(val);
	};
	const onChangeReduxclient = (val) => {
		dispatchRedux(searchclientads(val));
		setSearchval(val);
	};
	console.log((clientdirect || clientview) && clientmanageads.isLoading);
	console.log(!(clientdirect || clientview) && manageads && manageads.isLoading);
	// console.log(clientmanageads);
	if (
		(!(clientdirect || clientview) && manageads && manageads.isLoading) ||
		((clientdirect || clientview) && clientmanageads.isLoading)
	) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	const headers = [
		{ type: 'string', key: 'Adtitle', label: 'Name' },
		{ type: 'string', key: 'PricingModel', label: 'Pricing Model' },
		{ type: 'date', key: 'createdOn', label: 'Created On' },
		{ type: 'date', key: 'startDate', label: 'Start Date' },
		{ type: 'date', key: 'endDate', label: 'End Date' },
		{ type: 'number', key: 'remainingDays', label: 'Remaining Days' }
	];
	const headersClient = [
		{ type: 'string', key: 'campaignName', label: 'Name' },
		{ type: 'string', key: 'PricingModel', label: 'Pricing Model' },
		{ type: 'date', key: 'startDate', label: 'Start Date' },
		{ type: 'date', key: 'endDate', label: 'End Date' },
		{ type: 'number', key: 'remainingDays', label: 'Remaining Days' }
	];
	const headersAdminClient = [
		{ type: 'string', key: 'campaignName', label: 'Name' },
		{ type: 'string', key: 'userid', label: 'Clinet Name' },
		{ type: 'string', key: 'PricingModel', label: 'Pricing Model' },
		{ type: 'date', key: 'startDate', label: 'Start Date' },
		{ type: 'date', key: 'endDate', label: 'End Date' },
		{ type: 'number', key: 'remainingDays', label: 'Remaining Days' }
	];
	// console.log(manageads);
	if (!(clientdirect || clientview) && manageads && manageads.searchedmanageads) {
		const csvReport = {
			filename: 'ManageAds.csv',
			headers: headers,
			data: manageads.searchedmanageads
		};
		return (
			<div className="dashboard">
				<SearchCampagin state={user && user.user.usertype} inval={searchval} setInval={onChangeRedux} />
				<SortPaTable
					tabletype="campagins"
					headers={headers}
					csvReport={csvReport}
					orderManager={orderManager}
					clientview={clientview}
					clientdirect={clientdirect}
					adss={manageads.searchedmanageads}
					order={manageads.ordername}
					direc={manageads.orderdir}
					actionToSet={storepagination}
					pagination={manageads.pagination}
					rpp={manageads.rowspp}
				/>
			</div>
		);
	}
	if ((clientdirect || clientview) && clientmanageads && clientmanageads.searchedmanageads) {
		const csvReport = {
			filename: 'ManageAds.csv',
			headers: clientview ? headersAdminClient : headersClient,
			data: clientmanageads.searchedmanageads
		};
		return (
			<div className="dashboard">
				<SearchCampagin state={user && user.user.usertype} inval={searchval} setInval={onChangeReduxclient} />
				<SortPaTable
					tabletype="campagins"
					headers={clientview ? headersAdminClient : headersClient}
					csvReport={csvReport}
					orderManager={clientorderManager}
					clientview={clientview}
					clientdirect={clientdirect}
					adss={clientmanageads.searchedmanageads}
					order={clientmanageads.ordername}
					direc={clientmanageads.orderdir}
					actionToSet={clientstorepagination}
					pagination={clientmanageads.pagination}
					rpp={clientmanageads.rowspp}
				/>
			</div>
		);
	}
	return <h2>Error Occured... Try again</h2>;
	// return (
	// 	<div className="dashboard">
	// 		<SearchCampagin state={state && state.usertype} inval={searchval} setInval={onChange} />
	// 		{!loading ? (
	// 			<DataTable
	// 				clientview={clientview}
	// 				streamingads={streamingadsSearched}
	// 				settingcamp={setStreamingadsSearched}
	// 			/>
	// 		) : (
	// 			<div> loading... </div>
	// 		)}
	// 		{/* {streamingads.length ? "": <div> Loading... </div>} */}
	// 	</div>
	// );
}

export default Dashboard;

//const onChange = (val) => {
// 	var sec = [];
// 	var match = [];
// 	setSearchval(val);
// 	if (val) {
// 		sec = streamingads;
// 		sec.map((ads) => {
// 			if (ads.Adtitle.toLowerCase().indexOf(val.toLowerCase()) > -1) {
// 				match.push(ads);
// 			}
// 		});
// 		setStreamingadsSearched(match);
// 	} else {
// 		setStreamingadsSearched(streamingads);
// 	}
// };

// fetch('/streamingads/grouped', {
// 	method: 'get',
// 	headers: {
// 		'Content-Type': 'application/json',
// 		Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 	}
// })
// 	.then((res) => res.json())
// 	.then((result) => {
// 		console.log(result);
// 		var datareq = result;
// 		datareq = datareq.sort(function(a, b) {
// 			var d1 = new Date(a.endDate[0]);
// 			var d2 = new Date(b.endDate[0]);
// 			return d2 - d1;
// 		});
// 		setloading(false);
// 		setStreamingads(datareq);
// 		setStreamingadsSearched(datareq);
// 	})
// 	.catch((err) => {
// 		setloading(false);
// 		console.log(err);
// 	});
