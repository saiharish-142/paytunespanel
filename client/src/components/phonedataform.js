import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

export default function Phonedataform({ props, setShow, setsuccess, data1, seterror }) {
	console.log(props);

	const [ _id, set_id ] = useState(props._id);
	const [ make_model, setMake_model ] = useState(props.make_model ? props.make_model : '');
	const [ impression, setimpression ] = useState(props.extra_details ? props.extra_details.impression : '');
	const [ release, setrelease ] = useState(props.release ? props.release : '');
	const [ cost, setcost ] = useState(props.cost ? props.cost : '');
	const [ type, settype ] = useState(props.type ? props.type : '');
	const [ company, setcompany ] = useState(props.company ? props.company : '');
	const [ model, setmodel ] = useState(props.model ? props.model : '');
	const [ cumulative, setcumulative ] = useState(props.cumulative ? props.cumulative : '');
	const [ total_percent, settotal_percent ] = useState(props.total_percent ? props.total_percent : '');
	//load()
	function editPhonedata() {
		fetch('/subrepo/editphonedata', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				_id,
				make_model,
				impression,
				release,
				cost,
				type,
				company,
				model,
				cumulative,
				total_percent
			})
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					seterror(data.error);
					return console.log(data.error);
				}
				console.log(data);
				setShow(false);
				setsuccess(data);
				data1();
			});
	}

	function load() {
		setMake_model(props.make_model);
		setrelease(props.release);
		setcompany(props.company);
		setcost(props.cost);
		setcumulative(props.cumulative);
		setmodel(props.model);
		settotal_percent(props.total_percent);
		settype(props.type);
	}

	return (
		<div>
			<form style={{ margin: '2%' }}>
				<TextField
					placeholder="Make_And_Model"
					margin="dense"
					label="Make_And_Model"
					required={true}
					value={make_model ? make_model : ''}
					style={{ width: '30%' }}
					onChange={(e) => {
						setMake_model(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Impressions"
					margin="dense"
					label="Impressions (No Change)"
					required={true}
					style={{ width: '30%' }}
					value={impression ? impression : ''}
				/>
				<br />
				<TextField
					placeholder="Release Month and Year"
					margin="dense"
					label="Release Month and Year"
					style={{ width: '30%' }}
					value={release ? release : ''}
					required={true}
					onChange={(e) => {
						setrelease(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Cost"
					margin="dense"
					required={true}
					label="Cost"
					style={{ width: '30%' }}
					value={cost ? cost : ''}
					onChange={(e) => {
						setcost(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Company"
					margin="dense"
					required={true}
					label="Company"
					style={{ width: '30%' }}
					value={company ? company : ''}
					onChange={(e) => {
						setcompany(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Model"
					margin="dense"
					required={true}
					label="Model"
					style={{ width: '30%' }}
					value={model ? model : ''}
					onChange={(e) => {
						setmodel(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Type Of Device"
					margin="dense"
					label="Type of Device"
					style={{ width: '30%' }}
					value={type ? type : ''}
					required={true}
					onChange={(e) => {
						settype(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Cumulative %"
					margin="dense"
					label="Cumulative %"
					style={{ width: '30%' }}
					value={cumulative ? cumulative : ''}
					required={true}
					onChange={(e) => {
						setcumulative(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Total %"
					margin="dense"
					label="Total%"
					style={{ width: '30%' }}
					value={total_percent ? total_percent : ''}
					required={true}
					onChange={(e) => {
						settotal_percent(e.target.value);
					}}
				/>
				<br />
			</form>
			<button className="btn" style={{ marginBottom: '2%' }} onClick={editPhonedata}>
				Edit Info
			</button>
		</div>
	);
}
