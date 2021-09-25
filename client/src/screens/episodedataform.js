import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

export default function Episodedataform({ props, setShow, setsuccess, data1, seterror }) {
	console.log(props);

	const [ _id, set_id ] = useState(props._id);
	const [ publisher, setpublisher ] = useState(props.publisher ? props.publisher : '');
	const [ episodename, setepisodename ] = useState(props.episodename ? props.episodename : '');
	const [ category, setcategory ] = useState(props.category ? props.category : '');
	const [ requests, setrequests ] = useState(props.requests ? props.requests : '');
	const [ displayname, setdisplayname ] = useState(props.displayname ? props.displayname : '');
	const [ hostPosssibility, sethostPosssibility ] = useState(props.hostPosssibility ? props.hostPosssibility : '');
	const [ publishername, setpublishername ] = useState(props.publishername ? props.publishername : '');
	//load()
	function editEpisodedata() {
		fetch('/rtbreq/editepisodedata', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				_id,
				publisher,
				episodename,
	            category,
				requests,
				displayname,
				hostPosssibility,
				publishername
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
					placeholder="Host"
					margin="dense"
					label="Host"
					required={true}
					value={publisher ? publisher : ''}
					style={{ width: '60%' }}
					onChange={(e) => {
						setpublisher(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Episode Name"
					margin="dense"
					label="Episode Name"
					required={true}
					style={{ width: '60%' }}
					value={displayname ? displayname : ''}
					onChange={(e)=>{
						setdisplayname(e.target.value)
					}}
				/>
				<br />
				<TextField
					placeholder="Category"
					margin="dense"
					label="Category"
					style={{ width: '60%' }}
					value={category ? category : ''}
					required={true}
					onChange={(e) => {
						setcategory(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Requests"
					margin="dense"
					required={true}
					label="requests"
					style={{ width: '60%' }}
					value={requests ? requests : ''}
					onChange={(e) => {
						setrequests(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Display Name"
					margin="dense"
					required={true}
					label="Display Name"
					style={{ width: '60%' }}
					value={episodename ? episodename : ''}
					onChange={(e) => {
						setepisodename(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Host Possibility"
					margin="dense"
					required={true}
					label="Host Possibility"
					style={{ width: '60%' }}
					value={hostPosssibility ? hostPosssibility : ''}
					onChange={(e) => {
						sethostPosssibility(e.target.value);
					}}
				/>
				<br />
				<TextField
					placeholder="Publisher Name"
					margin="dense"
					required={true}
					label="Publisher Name"
					style={{ width: '60%' }}
					value={publishername ? publishername : ''}
					onChange={(e) => {
						setpublishername(e.target.value);
					}}
				/>
			</form>
			<button className="btn" style={{ marginBottom: '2%' }} onClick={editEpisodedata}>
				Edit Info
			</button>
		</div>
	);
}
