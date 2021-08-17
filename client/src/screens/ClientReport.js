import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import EnhancedTable from '../components/ClientTable';

function ClientReport() {
	const { campname } = useParams();
	const history = useHistory();
	const state = useSelector((state) => state.auth.user);
	const { dispatch1 } = useContext(IdContext);
	const [ singlead, setsinglead ] = useState({});
	const [ title, settitle ] = useState('');
	useEffect(
		() => {
			if (campname) {
				dispatch1({ type: 'ID', payload: campname });
			}
		},
		[ campname ]
	);
	useEffect(
		() => {
			if (campname) {
				fetch(`/auth/campdetails/${campname}`, {
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + localStorage.getItem('jwt')
					}
				})
					.then((res) => res.json())
					.then((result) => {
						setsinglead(result);
						settitle(result.campaignName);
						console.log(result);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		},
		[ campname ]
	);
	return (
		<div style={{ padding: '20px' }}>
			<div style={{ width: '10vw' }}>
				<button
					onClick={() => {
						if (state.usertype === 'admin') {
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
			</div>
			{/* <TitlRname title={title} settitle={settitle} submit={submitTitle} setloading={setloading} loading={loading} /> */}
			{/* <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div> */}
			<EnhancedTable title={title} singlead={singlead} />
		</div>
	);
}

export default ClientReport;
