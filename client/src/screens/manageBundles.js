import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom'
import PreLoader from '../components/loaders/PreLoader';
import SearchCampagin from '../components/SearchCampagin';
import SortPaTable from '../components/SortPaTable';
import { loadBundles, loadingBundles, orderManagerBundles, searchBundles } from '../redux/actions/manageBundlesAction';

function DashboardBundle({ clientview }) {
	// const history = useHistory()
	const dispatchRedux = useDispatch();
	const user = useSelector((state) => state.auth);
	const managebundles = useSelector((state) => state.managebundles);
	const [ searchval, setSearchval ] = useState('');
	useEffect(() => {
		if (managebundles && !managebundles.managebundles) {
			dispatchRedux(loadingBundles());
			dispatchRedux(loadBundles());
		}
		if (managebundles && managebundles.value) {
			setSearchval(managebundles.value);
		}
	}, []);
	// const onChange = (val) => {
	// 	var sec = [];
	// 	var match = [];
	// 	setSearchval(val);
	// 	// console.log(val.toLowerCase())
	// 	if (val) {
	// 		sec = streamingads;
	// 		// console.log(sec)
	// 		sec.map((ads) => {
	// 			// console.log(ads.Adtitle)
	// 			if (ads.Adtitle.toLowerCase().indexOf(val.toLowerCase()) > -1) {
	// 				// console.log('not1')
	// 				match.push(ads);
	// 			}
	// 		});
	// 		setStreamingadsSearched(match);
	// 	} else {
	// 		setStreamingadsSearched(streamingads);
	// 	}
	// };
	const onChangeRedux = (val) => {
		dispatchRedux(searchBundles(val));
		setSearchval(val);
	};
	if (managebundles && managebundles.isLoading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	const headers = [
		{ type: 'string', id: 'bundleadtitle', lable: 'Name' },
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
	if (managebundles && managebundles.searchedmanagebundles) {
		return (
			<div className="dashboard">
				<SearchCampagin state={user && user.usertype} inval={searchval} setInval={onChangeRedux} />
				<SortPaTable
					tabletype="bundles"
					headers={headers}
					orderManager={orderManagerBundles}
					clientview={clientview}
					adss={managebundles.searchedmanagebundles}
					order={managebundles.ordername}
					direc={managebundles.orderdir}
				/>
			</div>
		);
	}
	// return (
	// 	<div className="dashboard">
	// 		<SearchCampagin state={state && state.usertype} inval={searchval} setInval={onChange} />
	// 		{!loading ? (
	// 			<StickyHeadTablebundle
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

export default DashboardBundle;
