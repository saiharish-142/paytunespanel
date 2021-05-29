import { Breadcrumbs } from '@material-ui/core';
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import PreLoader from '../components/loaders/PreLoader';
// import EnhancedTable from '../components/Table';
import TablePro from '../components/tablePro';
import { ClearReport, idStorer, loadReportBase, ReportLoading } from '../redux/actions/reportActions';
// import M from 'materialize-css'

function Report() {
	const { campname } = useParams();
	const history = useHistory();
	const dispatchRedux = useDispatch();
	const report = useSelector((state) => state.report);
	const { dispatch1 } = useContext(IdContext);
	console.log(report);
	useEffect(
		() => {
			dispatchRedux(ClearReport());
			if (campname) {
				dispatchRedux(ReportLoading());
				dispatchRedux(idStorer(campname));
				dispatch1({ type: 'ID', payload: campname });
				dispatchRedux(loadReportBase());
			}
		},
		[ campname ]
	);
	// useEffect(
	// 	() => {
	// 		if (campname) {
	// 			fetch(`/streamingads/groupedsingle`, {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					adtitle: campname
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					// settitle(result[0].AdTitle)
	// 					// setloading(false)
	// 					setsinglead(result);
	// 					console.log(result);
	// 				})
	// 				.catch((err) => {
	// 					// setloading(false)
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ campname ]
	// );
	// console.log(id);
	if (report && report.isLoading) {
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
					onClick={() => history.push(`/manageAds`)}
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
					<Link style={{ color: 'black' }} to="/manageAds">
						Manage Ads
					</Link>
					<Link style={{ color: 'black' }} href={`/manageAds/${report.title}`}>
						{report.title}
					</Link>
				</Breadcrumbs>
			</div>
			<TablePro />
			{/* <EnhancedTable singlead={singlead} /> */}
		</div>
	);
}

export default Report;
