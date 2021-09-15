import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import EnhancedTable from '../components/ClientTable';
import PreLoader from '../components/loaders/PreLoader';
import { clientReportBase, ClientSummDet, idStorer, ReportLoading } from '../redux/actions/reportActions';
import { Breadcrumbs } from '@material-ui/core';
import { Link } from 'react-router-dom';

function SummaryClientDep({ adminView }) {
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
			if (campname && campname != report.req_id) {
				dispatchRedux(ReportLoading());
				dispatchRedux(idStorer(campname));
				dispatch1({ type: 'ID', payload: campname });
				dispatchRedux(clientReportBase());
			}
		},
		[ campname ]
	);
	useEffect(
		() => {
			if (!report.isLoading) {
				// dispatchRedux(ClientSummDet());
			}
		},
		[ report.isLoading ]
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
							history.push(`/clientSideCamp/${report.req_id}`);
						} else {
							history.push(`/manageAds/${report.req_id}`);
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
					<Link
						style={{ color: 'black' }}
						onClick={() => {
							if (adminView) {
								history.push(`/clientSideCamp/${report.req_id}`);
							} else {
								history.push(`/manageAds/${report.req_id}`);
							}
						}}
						href={`/clientSideCamp/${report.req_id}`}
					>
						{report.title}
					</Link>
					<Link style={{ color: 'black' }} href={`/clientSideCamp/${report.req_id}/summarydetailed`}>
						Detailed Summary
					</Link>
				</Breadcrumbs>
			</div>
			<div />
		</div>
	);
}

export default SummaryClientDep;
