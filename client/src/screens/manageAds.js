import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom'
import SearchCampagin from '../components/SearchCampagin';
import { useDispatch, useSelector } from 'react-redux';
import { loadAds, loadingAds, searchads } from '../redux/actions/manageadsAction';
import PreLoader from '../components/loaders/PreLoader';
import SortPaTable from '../components/SortPaTable';
import { orderManager } from '../redux/actions/manageadsAction';

function Dashboard({ clientview }) {
	const dispatchRedux = useDispatch();
	const manageads = useSelector((state) => state.manageads);
	const user = useSelector((state) => state.auth);
	const [ searchval, setSearchval ] = useState('');
	useEffect(() => {
		if (manageads && !manageads.manageads) {
			dispatchRedux(loadingAds());
			dispatchRedux(loadAds());
		}
		if (manageads && manageads.value) {
			setSearchval(manageads.value);
		}
	}, []);
	const onChangeRedux = (val) => {
		dispatchRedux(searchads(val));
		setSearchval(val);
	};

	if (manageads && manageads.isLoading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	const headers = [
		{ type: 'string', id: 'Adtitle', lable: 'Name' },
		{ type: 'string', id: 'Advertiser', lable: 'Advertiser' },
		{ type: 'string', id: 'Pricing', lable: 'Pricing' },
		{ type: 'string', id: 'ro', lable: 'RO from Advertiser' },
		{ type: 'string', id: 'PricingModel', lable: 'Pricing Model' },
		{ type: 'string', id: 'Category', lable: 'Category' },
		{ type: 'date', id: 'createdOn', lable: 'Created On' },
		{ type: 'date', id: 'startDate', lable: 'Start Date' },
		{ type: 'date', id: 'endDate', lable: 'End Date' },
		{ type: 'number', id: 'remainingDays', lable: 'Remaining Days' }
	];
	// console.log(manageads);
	if (manageads && manageads.searchedmanageads) {
		return (
			<div className="dashboard">
				<SearchCampagin state={user && user.usertype} inval={searchval} setInval={onChangeRedux} />
				<SortPaTable
					tabletype="campagins"
					headers={headers}
					orderManager={orderManager}
					clientview={clientview}
					adss={manageads.searchedmanageads}
					order={manageads.ordername}
					direc={manageads.orderdir}
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
