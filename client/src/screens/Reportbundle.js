import { Breadcrumbs } from '@material-ui/core';
import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import PreLoader from '../components/loaders/PreLoader';
// import BasicTableBundle from '../components/TableBundle';
import TablePro from '../components/tablePro';
import { ClearReport, idStorer, loadReportBaseBundle, ReportLoading } from '../redux/actions/reportActions';

function ReportBundle() {
	const { campname } = useParams();
	const history = useHistory();
	const dispatchRedux = useDispatch();
	const { dispatch1 } = useContext(IdContext);
	const report = useSelector((state) => state.report);
	const [ singlead, setsinglead ] = useState({});
	const [ title, settitle ] = useState('');
	console.log(report);
	useEffect(
		() => {
			dispatchRedux(ClearReport());
			if (campname) {
				dispatchRedux(ReportLoading());
				dispatchRedux(idStorer(campname));
				dispatch1({ type: 'ID', payload: campname });
				dispatchRedux(loadReportBaseBundle());
				fetch(`/bundles/grp/${campname}`, {
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + localStorage.getItem('jwt')
					}
				})
					.then((res) => res.json())
					.then((result) => {
						settitle(result.bundleadtitle);
						setsinglead(result);
						console.log(result);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		},
		[ campname ]
	);
	// const submitTitle = (adtitle) =>{
	//     if(adtitle){
	//         fetch(`/streamingads/updatename/${campname}`,{
	//             method:'put',
	//             headers:{
	//                 "Content-Type":"application/json",
	//                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
	//             },body:JSON.stringify({
	//                 adtitle
	//             })
	//         }).then(res=>res.json())
	//         .then(result=>{
	//             setloading(false)
	//             setsinglead(result)
	//             // console.log(result)
	//         })
	//         .catch(err =>{
	//             setloading(false)
	//             console.log(err)
	//         })
	//     }else{
	//         M.toast({html:"Ad Title Shouldn't be empty", classes:'#ff5252 red accent-2'})
	//     }
	// }
	// console.log(id)
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
					<Link style={{ color: 'black' }} to="/manageBundles">
						Manage Bundles
					</Link>
					<Link style={{ color: 'black' }} href={`/manageBundles/${report.req_id}`}>
						{report.title}
					</Link>
				</Breadcrumbs>
			</div>
			<TablePro />
			{/* <EnhancedTable singlead={singlead} /> */}
		</div>
	);
}

export default ReportBundle;
