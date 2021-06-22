import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

export default function Zipdataform({ props, setShow, setsuccess, data1, seterror }) {
	console.log(props._id);
	const [_id, set_id] = useState(props._id);
	const [pincode, setpincode] = useState(props.pincode ? props.pincode : '');
	const [area, setarea] = useState(props.area ? props.area : '');
	const [lowersubcity, setlowersubcity] = useState(props.lowersubcity ? props.lowersubcity : '');
	const [subcity, setSubcity] = useState(props.subcity ? props.subcity : '');
	const [comparison, setcomparison] = useState(props.comparison ? props.comparison : '');
	const [grandcity, setGrandcity] = useState(props.grandcity ? props.grandcity : '');
	const [district, setDistrict] = useState(props.district ? props.district : '');
	const [state, setstate] = useState(props.state ? props.state : '');
	const [grandstate, setgrandstate] = useState(props.grandstate ? props.grandstate : '');
	const [latitude, setlatitude] = useState(props.latitude ? props.latitude : '');
	const [longitude, setlongitude] = useState(props.longitude ? props.longitude : '');
	const [city, setcity] = useState(props.city ? props.city : '');

	function editZipdata() {
		fetch('/subrepo/editzipdata', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				_id,
				pincode,
				area,
				lowersubcity,
				subcity,
				comparison,
				grandcity,
				district,
				state,
				grandstate,
				city,
				latitude,
				longitude
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

	return (
		<div>
			<form style={{ margin: '2%' }}>
				<TextField
					placeholder="Pincode"
					margin="dense"
					label="Pincode"
					required={true}
					value={pincode ? pincode : ''}
					style={{ width: '60%' }}
					onChange={(e) => {
						setpincode(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Area"
					margin="dense"
					label="Area"
					required={true}
					style={{ width: '60%' }}
					value={area ? area : ''}
					onChange={(e) => {
						setarea(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="City"
					margin="dense"
					label="City"
					style={{ width: '60%' }}
					value={city ? city : ''}
					required={true}
					onChange={(e) => {
						setcity(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Lower Sub City"
					margin="dense"
					label="Lower Sub City"
					style={{ width: '60%' }}
					value={lowersubcity ? lowersubcity : ''}
					required={true}
					onChange={(e) => {
						setlowersubcity(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Subcity"
					margin="dense"
					required={true}
					label="Subcity"
					style={{ width: '60%' }}
					value={subcity ? subcity : ''}
					onChange={(e) => {
						setSubcity(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Grandcity"
					margin="dense"
					required={true}
					label="Grandcity"
					style={{ width: '60%' }}
					value={grandcity ? grandcity : ''}
					onChange={(e) => {
						setGrandcity(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="District"
					margin="dense"
					required={true}
					label="District"
					style={{ width: '60%' }}
					value={district ? district : ''}
					onChange={(e) => {
						setDistrict(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Comparison"
					margin="dense"
					label="Comparison"
					style={{ width: '60%' }}
					value={comparison ? comparison : ''}
					required={true}
					onChange={(e) => {
						setcomparison(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="State"
					margin="dense"
					label="State"
					style={{ width: '60%' }}
					value={state ? state : ''}
					required={true}
					onChange={(e) => {
						setstate(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Grandstate"
					margin="dense"
					label="Grandstate"
					style={{ width: '60%' }}
					value={grandstate ? grandstate : ''}
					required={true}
					onChange={(e) => {
						setgrandstate(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Latitude"
					margin="dense"
					label="Latitude"
					style={{ width: '60%' }}
					value={latitude ? latitude : ''}
					required={true}
					onChange={(e) => {
						setlatitude(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Longitude"
					margin="dense"
					label="Longitude"
					style={{ width: '60%' }}
					value={longitude ? longitude : ''}
					required={true}
					onChange={(e) => {
						setlongitude(e.target.value);
					}}
				/>
				<br />
			</form>
			<button className="btn" style={{ marginBottom: '2%' }} onClick={editZipdata}>
				Edit Info
			</button>
		</div>
	);
}
