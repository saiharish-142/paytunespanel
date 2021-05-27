import React, { useContext, useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom'
import DataTable from '../components/CampTable';
import SearchCampagin from '../components/SearchCampagin';
import { UserContext } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { loadAds, loadingAds, searchads } from '../redux/actions/manageadsAction';
import PreLoader from '../components/loaders/PreLoader';
import SortPaTable from '../components/SortPaTable';
import { orderManager } from '../redux/actions/manageadsAction';

function Dashboard({ clientview }) {
	const dispatchRedux = useDispatch();
	const manageads = useSelector((state) => state.manageads);
	const user = useSelector((state) => state.auth);
	const { state } = useContext(UserContext);
	const [ loading, setloading ] = useState(true);
	const [ searchval, setSearchval ] = useState('');
	const [ streamingads, setStreamingads ] = useState([]);
	const [ streamingadsSearched, setStreamingadsSearched ] = useState([]);
	useEffect(() => {
		if (manageads && !manageads.manageads) {
			dispatchRedux(loadingAds());
			dispatchRedux(loadAds());
		}
		if (manageads && manageads.value) {
			setSearchval(manageads.value);
		}
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
	}, []);
	const onChangeRedux = (val) => {
		dispatchRedux(searchads(val));
		setSearchval(val);
	};
	// const onChange = (val) => {
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

	if (manageads && manageads.isLoading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	const headers = [
		{ id: 'Adtitle', lable: 'Name' },
		{ id: 'Advertiser', lable: 'Advertiser' },
		{ id: 'Pricing', lable: 'Pricing' },
		{ id: 'ro', lable: 'RO from Advertiser' },
		{ id: 'PricingModel', lable: 'Pricing Model' },
		{ id: 'Category', lable: 'Category' },
		{ id: 'createdOn', lable: 'Created On' },
		{ id: 'startDate', lable: 'Start Date' },
		{ id: 'endDate', lable: 'End Date' },
		{ id: 'remainingDays', lable: 'Remaining Days' }
	];
	// console.log(manageads);
	if (manageads && manageads.searchedmanageads) {
		return (
			<div className="dashboard">
				<SearchCampagin state={user && user.usertype} inval={searchval} setInval={onChangeRedux} />
				<SortPaTable
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
