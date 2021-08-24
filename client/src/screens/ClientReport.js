import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import EnhancedTable from '../components/ClientTable';
import PreLoader from '../components/loaders/PreLoader';
import { clientReportBase, idStorer } from '../redux/actions/reportActions';
import { Breadcrumbs } from '@material-ui/core';
import { Link } from 'react-router-dom';

function ClientReport({ adminView }) {
	const { campname } = useParams();
	const dispatchRedux = useDispatch();
	const report = useSelector((state) => state.report);
	const history = useHistory();
	const state = useSelector((state) => state.auth.user);
	const { dispatch1 } = useContext(IdContext);
	// const [ singlead, setsinglead ] = useState({});
	// const [ title, settitle ] = useState('');
	useEffect(
		() => {
			if (campname) {
				dispatchRedux(idStorer(campname));
				dispatch1({ type: 'ID', payload: campname });
				dispatchRedux(clientReportBase());
			}
		},
		[ campname ]
	);
	if (report.isLoading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	return (
		<div style={{ padding: '20px' }}>
			<div style={{ minWidth: '60vw', display: 'flex', alignItems: 'center' }}>
				<button
					onClick={() => {
						if (adminView) {
							history.push(`/clientSideCamp`);
						} else {
							history.push(`/manageAds`);
						}
					}}
					className="btn #424242 grey darken-3"
					style={{ margin: '20px', textAlign: 'left' }}
				>
					Back
				</button>
				<Breadcrumbs
					style={{
						width: 'fit-content',
						height: 'fit-content',
						padding: '10px',
						background: 'white',
						color: 'black'
					}}
					aria-label="breadcrumb"
				>
					<Link style={{ color: 'black' }} to="/clientSideCamp">
						Manage Ads
					</Link>
					<Link style={{ color: 'black' }} href={`/clientSideCamp/${report.req_id}`}>
						{report.title}
					</Link>
				</Breadcrumbs>
			</div>
			{/* <TitlRname title={title} settitle={settitle} submit={submitTitle} setloading={setloading} loading={loading} /> */}
			{/* <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div> */}
			<EnhancedTable title={report.title} id={campname} />
		</div>
	);
}

export default ClientReport;

// useEffect(
// 	() => {
// 		if (campname) {
// 			fetch(`/auth/campdetails/${campname}`, {
// 				method: 'get',
// 				headers: {
// 					'Content-Type': 'application/json',
// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 				}
// 			})
// 				.then((res) => res.json())
// 				.then(async (result) => {
// 					setsinglead(result);
// 					settitle(result.campaignName);
// 					console.log(result);
// 					fetch('/streamingads/groupedsingleClient', {
// 						method: 'put',
// 						headers: {
// 							'Content-Type': 'application/json',
// 							Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 						},
// 						body: JSON.stringify({
// 							adtitle: result.campaignName,
// 							podcast: result.podcast,
// 							onDemand: result.onDemand,
// 							musicapps: result.musicapps
// 						})
// 					})
// 						.then((res) => res.json())
// 						.then((ids) => {
// 							console.log(ids);
// 						})
// 						.catch((err) => console.log(err));
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 				});
// 		}
// 	},
// 	[ campname ]
// );
