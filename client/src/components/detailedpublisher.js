import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import { Typography } from '@material-ui/core';
import IconBreadcrumbs from '../components/breadBreed';
import { StrikethroughSTwoTone } from '@material-ui/icons';

export default function DetailedTable() {
	const history = useHistory();
	const { state1, dispatch1 } = useContext(IdContext);
    const [rows,setrows]=useState([]);
	const { campname } = useParams();
	const [ ids, setids ] = useState([]);
	const [ title, settitle ] = useState('');
	const [ datelogs, setdatelogs ] = useState([]);
	const [ publishlogs, setpublishlogs ] = useState([]);
	const [ datelogsd, setdatelogsd ] = useState([]);
	const [ publishlogsd, setpublishlogsd ] = useState([]);
	const [ datelogsv, setdatelogsv ] = useState([]);
	const [ publishlogsv, setpublishlogsv ] = useState([]);
	const [ phonedata, setphonedata ] = useState([]);
	const [ currentad, setcurrentad ] = useState('');
    const {pubname}=useParams();
    console.log(pubname)
	// id pusher to redux
	useEffect(
		() => {
			if (campname) {
				dispatch1({ type: 'ID', payload: campname });
			}
		},
		[ campname ]
	);
	// to get the ids
	useEffect(
		() => {
			if (campname) {
				fetch('/streamingads/getids', {
					method: 'put',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + localStorage.getItem('jwt')
					},
					body: JSON.stringify({
						adtitle: campname
					})
				})
					.then((res) => res.json())
					.then((idds) => {
						console.log(idds)
						setids(idds)
						console.log(ids)
						fetch('/offreport/reportbycamp', {
							method: 'put',
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + localStorage.getItem('jwt')
							},
							body: JSON.stringify({
								campaignId: idds,
								pubname
							})
						})
							.then((res) => res.json())
							.then((result) => {
								var plogs = result;
								result.map((adad) => {
									if (
										adad.appId._id.toString() === '5b2210af504f3097e73e0d8b' ||
										adad.appId._id.toString() === '5d10c405844dd970bf41e2af'
									) {
										adad.appId.AppName += ' offline';
									}
								});
								plogs = plogs.sort(function(a, b) {
									var d1 = new Date(a._id.date);
									var d2 = new Date(b._id.date);
									return d2 - d1;
								});
								// plogs = plogs.sort(function(a, b) {
								// 	var d1 = new Date(a.createdAt ? a.createdAt : a.createdOn);
								// 	var d2 = new Date(b.createdAt ? b.createdAt : b.createdOn);
								// 	if (a.date === b.date) return d2 - d1;
								// });
								console.log(plogs);
								setpublishlogs(plogs);
								console.log(publishlogs)
								// console.log(result)
							})
							.catch((err) => {
								console.log(err);
							});
					})
					.catch((err) => console.log(err));
			}
		},
		[ campname ]
	);
	// useEffect(
	// 	() => {
	// 		if (ids && ids.audio) {
	// 			fetch('/report/reportbycamp', {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					campaignId: ids.audio
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					// setpublishlogs(result)
	// 					// offlinereportspublisher(result);
	// 					// console.log(result)
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ ids ]
	// );

        // useEffect(()=>{
        //     if(ids){
        //         fetch('/report/reportbycamp', {
		// 			method: 'put',
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 				Authorization: 'Bearer ' + localStorage.getItem('jwt')
		// 			},
		// 			body: JSON.stringify({
		// 				campaignId: ids.audio
		// 			})
		// 		})
		// 			.then((res) => res.json())
		// 			.then((result) => {
		// 				setrows(result);
		// 			})
		// 			.catch((err) => {
		// 				console.log(err);
		// 			});
        //     }
        // })

	// useEffect (() => {
    //     if(ids){
    //         console.log('hhh',ids)
	// 	fetch('/offreport/reportbycamp', {
	// 		method: 'put',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		},
	// 		body: JSON.stringify({
	// 			campaignId: ids,
    //             pubname
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then((result) => {
	// 			var plogs = result;
	// 			result.map((adad) => {
	// 				if (
	// 					adad.appId._id.toString() === '5b2210af504f3097e73e0d8b' ||
	// 					adad.appId._id.toString() === '5d10c405844dd970bf41e2af'
	// 				) {
	// 					adad.appId.AppName += ' offline';
	// 				}
	// 			});
	// 			plogs = plogs.sort(function(a, b) {
	// 				var d1 = new Date(a.date);
	// 				var d2 = new Date(b.date);
	// 				return d2 - d1;
	// 			});
	// 			plogs = plogs.sort(function(a, b) {
	// 				var d1 = new Date(a.createdAt ? a.createdAt : a.createdOn);
	// 				var d2 = new Date(b.createdAt ? b.createdAt : b.createdOn);
	// 				if (a.date === b.date) return d2 - d1;
	// 			});
	// 			console.log(plogs);
	// 			setpublishlogs(plogs);
	// 			// console.log(result)
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
    //     }
	// },[]);
	// useEffect(
	// 	() => {
	// 		if (ids && ids.display) {
	// 			fetch('/report/reportbycamp', {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					campaignId: ids.display
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					// setpublishlogsd(result)
	// 					offlinereportspublisherd(result);
	// 					// console.log(result)
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ ids ]
	// );
	// const offlinereportspublisherd = (logs) => {
	// 	fetch('/offreport/reportbycamp', {
	// 		method: 'put',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		},
	// 		body: JSON.stringify({
	// 			campaignId: ids.display
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then((result) => {
	// 			var plogs = result;
	// 			result.map((adad) => {
	// 				if (
	// 					adad.appId._id.toString() === '5b2210af504f3097e73e0d8b' ||
	// 					adad.appId._id.toString() === '5d10c405844dd970bf41e2af'
	// 				) {
	// 					adad.appId.AppName += ' offline';
	// 				}
	// 			});
	// 			// console.log(result)
	// 			// plogs = plogs.concat(logs)
	// 			plogs = plogs.sort(function(a, b) {
	// 				var d1 = new Date(a.date);
	// 				var d2 = new Date(b.date);
	// 				return d2 - d1;
	// 			});
	// 			plogs = plogs.sort(function(a, b) {
	// 				var d1 = new Date(a.createdAt ? a.createdAt : a.createdOn);
	// 				var d2 = new Date(b.createdAt ? b.createdAt : b.createdOn);
	// 				if (a.date === b.date) return d2 - d1;
	// 			});
	// 			console.log(plogs);
	// 			setpublishlogsd(plogs);
	// 			// console.log(result)
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	// useEffect(
	// 	() => {
	// 		if (ids && ids.video) {
	// 			fetch('/report/reportbycamp', {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					campaignId: ids.video
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					// setpublishlogsv(result)
	// 					offlinereportspublisherv(result);
	// 					// console.log(result)
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ ids ]
	// );
	// const offlinereportspublisherv = (logs) => {
	// 	fetch('/offreport/reportbycamp', {
	// 		method: 'put',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		},
	// 		body: JSON.stringify({
	// 			campaignId: ids.video
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then((result) => {
	// 			var plogs = result;
	// 			result.map((adad) => {
	// 				if (
	// 					adad.appId._id.toString() === '5b2210af504f3097e73e0d8b' ||
	// 					adad.appId._id.toString() === '5d10c405844dd970bf41e2af'
	// 				) {
	// 					adad.appId.AppName += ' offline';
	// 				}
	// 			});
	// 			// console.log(result)
	// 			// plogs = plogs.concat(logs)
	// 			plogs = plogs.sort(function(a, b) {
	// 				var d1 = new Date(a.date);
	// 				var d2 = new Date(b.date);
	// 				return d2 - d1;
	// 			});
	// 			plogs = plogs.sort(function(a, b) {
	// 				var d1 = new Date(a.createdAt ? a.createdAt : a.createdOn);
	// 				var d2 = new Date(b.createdAt ? b.createdAt : b.createdOn);
	// 				if (a.date === b.date) return d2 - d1;
	// 			});
	// 			console.log(plogs);
	// 			setpublishlogsv(plogs);
	// 			// console.log(result)
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	// useEffect(
	// 	() => {
	// 		if (ids && ids.audio) {
	// 			fetch('/report/detreportcambydat', {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					campaignId: ids.audio
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					// setdatelogs(result)
	// 					offlinereportsdate(result);
	// 					// console.log(result)
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ ids ]
	// );
	// const offlinereportsdate = (logs) => {
	// 	fetch('/offreport/detreportcambydat', {
	// 		method: 'put',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		},
	// 		body: JSON.stringify({
	// 			campaignId: ids.audio
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then(async (result) => {
	// 			var dlogs = result;
	// 			// console.log(result,'re')
	// 			// dlogs = dlogs.concat(logs)
	// 			dlogs = await dlogs.sort(function(a, b) {
	// 				var d1 = new Date(a.date);
	// 				var d2 = new Date(b.date);
	// 				return d2 - d1;
	// 			});
	// 			dlogs = dlogs.sort(function(a, b) {
	// 				var d1 = new Date(a.updatedAt[0]);
	// 				var d2 = new Date(b.updatedAt[0]);
	// 				if (a.date === b.date) return d2 - d1;
	// 			});
	// 			console.log(dlogs);
	// 			setdatelogs(dlogs);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	// useEffect(
	// 	() => {
	// 		if (ids && ids.display) {
	// 			fetch('/report/detreportcambydat', {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					campaignId: ids.display
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					// setdatelogsd(result)
	// 					offlinereportsdated(result);
	// 					// console.log(result)
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ ids ]
	// );
	// useEffect(
	// 	() => {
	// 		if (ids) {
	// 			// let arr=[]
	// 			// ids.audio.forEach((audio)=>
	// 			// {
	// 			// 	arr.push(audio)
	// 			// })
	// 			// ids.video.forEach((audio)=>
	// 			// {
	// 			// 	arr.push(audio)
	// 			// })
	// 			// ids.display.forEach((audio)=>
	// 			// {
	// 			// 	arr.push(audio)
	// 			// })
	// 			fetch('/report/detailedphonemodelreports', {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					campaignId: ids
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					setphonedata(result);
	// 					// setpublishlogsv(result)
	// 					// offlinereportspublisherv(result);
	// 					// console.log(result)
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ ids ]
	// );
	// const offlinereportsdated = (logs) => {
	// 	fetch('/offreport/detreportcambydat', {
	// 		method: 'put',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		},
	// 		body: JSON.stringify({
	// 			campaignId: ids.display
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then(async (result) => {
	// 			var dlogs = result;
	// 			// console.log(result,'re')
	// 			// dlogs = dlogs.concat(logs)
	// 			dlogs = await dlogs.sort(function(a, b) {
	// 				var d1 = new Date(a.date);
	// 				var d2 = new Date(b.date);
	// 				return d2 - d1;
	// 			});
	// 			dlogs = dlogs.sort(function(a, b) {
	// 				var d1 = new Date(a.updatedAt[0]);
	// 				var d2 = new Date(b.updatedAt[0]);
	// 				if (a.date === b.date) return d2 - d1;
	// 			});
	// 			console.log(dlogs);
	// 			setdatelogsd(dlogs);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	// useEffect(
	// 	() => {
	// 		if (ids && ids.video) {
	// 			fetch('/report/detreportcambydat', {
	// 				method: 'put',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 				},
	// 				body: JSON.stringify({
	// 					campaignId: ids.video
	// 				})
	// 			})
	// 				.then((res) => res.json())
	// 				.then((result) => {
	// 					// setdatelogsv(result)
	// 					offlinereportsdatev(result);
	// 					// console.log(result)
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				});
	// 		}
	// 	},
	// 	[ ids ]
	// );
	// const offlinereportsdatev = (logs) => {
	// 	fetch('/offreport/detreportcambydat', {
	// 		method: 'put',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		},
	// 		body: JSON.stringify({
	// 			campaignId: ids.video
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then(async (result) => {
	// 			var dlogs = result;
	// 			// console.log(result,'re')
	// 			// dlogs = dlogs.concat(logs)
	// 			dlogs = await dlogs.sort(function(a, b) {
	// 				var d1 = new Date(a.date);
	// 				var d2 = new Date(b.date);
	// 				return d2 - d1;
	// 			});
	// 			dlogs = dlogs.sort(function(a, b) {
	// 				var d1 = new Date(a.updatedAt[0]);
	// 				var d2 = new Date(b.updatedAt[0]);
	// 				if (a.date === b.date) return d2 - d1;
	// 			});
	// 			console.log(dlogs);
	// 			setdatelogsv(dlogs);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	// console.log(id)
	const dateformatchanger = (date) => {
		var dategot = date.toString();
		var datechanged = dategot.slice(8, 10) + '-' + dategot.slice(5, 7) + '-' + dategot.slice(0, 4);
		return datechanged;
	};
	const updatedatetimeseter = (date) => {
		// console.log(date)
		// var datee = new Date(date);
		var s = new Date(date).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
		// var datee = datee.toString();
		// console.log(s,date,s.split('/'))
		s = s.split('/');
		return s[1] + '/' + s[0] + '/' + s[2];
	};
	const datefinder = () => {
		if (datelogs.length) {
			if (datelogs[0].updatedAt && datelogs[0].updatedAt.length) {
				return updatedatetimeseter(datelogs[0].updatedAt[0]);
			} else {
				if (datelogsd.length) {
					if (datelogsd[0].updatedAt && datelogsd[0].updatedAt.length) {
						return updatedatetimeseter(datelogsd[0].updatedAt[0]);
					} else {
						if (datelogsv.length) {
							if (datelogsv[0].updatedAt && datelogsv[0].updatedAt.length) {
								return updatedatetimeseter(datelogsv[0].updatedAt[0]);
							} else {
								return 'not found';
							}
						} else {
							return 'not found';
						}
					}
				} else {
					if (datelogsv.length) {
						if (datelogsv[0].updatedAt && datelogsv[0].updatedAt.length) {
							return updatedatetimeseter(datelogsv[0].updatedAt[0]);
						} else {
							return 'not found';
						}
					} else {
						return 'not found';
					}
				}
			}
		} else {
			if (datelogsd.length) {
				if (datelogsd[0].updatedAt && datelogsd[0].updatedAt.length) {
					return updatedatetimeseter(datelogsd[0].updatedAt[0]);
				} else {
					if (datelogsv.length) {
						if (datelogsv[0].updatedAt && datelogsv[0].updatedAt.length) {
							return updatedatetimeseter(datelogsv[0].updatedAt[0]);
						} else {
							return 'not found';
						}
					} else {
						return 'not found';
					}
				}
			} else {
				if (datelogsv.length) {
					if (datelogsv[0].updatedAt && datelogsv[0].updatedAt.length) {
						return updatedatetimeseter(datelogsv[0].updatedAt[0]);
					} else {
						return 'not found';
					}
				} else {
					return 'not found';
				}
			}
		}
	};
	const datefinderpublisher = () => {
		if (publishlogs.length) {
			if (publishlogs[0].createdOn) {
				return updatedatetimeseter(publishlogs[0].createdOn);
			} else {
				if (publishlogsd.length) {
					if (publishlogsd[0].createdOn) {
						return updatedatetimeseter(publishlogsd[0].createdOn);
					} else {
						if (publishlogsv.length) {
							if (publishlogsv[0].createdOn) {
								return updatedatetimeseter(publishlogsv[0].createdOn);
							} else {
								return 'not found';
							}
						} else {
							return 'not found';
						}
					}
				} else {
					if (publishlogsv.length) {
						if (publishlogsv[0].createdOn) {
							return updatedatetimeseter(publishlogsv[0].createdOn);
						} else {
							return 'not found';
						}
					} else {
						return 'not found';
					}
				}
			}
		} else {
			if (publishlogsd.length) {
				if (publishlogsd[0].createdOn) {
					return updatedatetimeseter(publishlogsd[0].createdOn);
				} else {
					if (publishlogsv.length) {
						if (publishlogsv[0].createdOn) {
							return updatedatetimeseter(publishlogsv[0].createdOn);
						} else {
							return 'not found';
						}
					} else {
						return 'not found';
					}
				}
			} else {
				if (publishlogsv.length) {
					if (publishlogsv[0].createdOn) {
						return updatedatetimeseter(publishlogsv[0].createdOn);
					} else {
						return 'not found';
					}
				} else {
					return 'not found';
				}
			}
		}
	};
	return (
		<div style={{ paddingBottom: '50px' }}>
			<div style={{ width: '10vw' }}>
				<button
					onClick={() => history.push(`/manageAds/${state1}`)}
					className="btn #424242 grey darken-3"
					style={{ margin: '10px 0 20px 0', textAlign: 'left' }}
				>
					Back
				</button>
			</div>
			<br />
			<IconBreadcrumbs />
			<div
				style={{
					margin: '10px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				{state1 && state1.toUpperCase()} Campaign
			</div>
			<div
				style={{
					margin: '0px auto',
					fontSize: 'larger',
					width: 'fit-content',
					fontWeight: '500',
					borderBottom: '1px solid black'
				}}
			>
				Detailed Report
			</div>
			<TableContainer style={{ margin: '10px auto', width: 'fit-content' }} component={Paper}>
				<Typography variant="h6" id="tableTitle" component="div">
				Publisher Detailed Report
				</Typography>
				<div>last updated at - {datefinder()}</div>
				{/* <div style={{ margin: '5px', fontWeight: 'bolder' }}></div> */}
				<Table
					style={{ margin: '20px', width: 'fit-content', border: '1px lightgray solid' }}
					aria-label="simple table"
				>
					<TableHead>
						<TableRow>
                        <TableCell>Date</TableCell>
							<TableCell>Publisher</TableCell>
							<TableCell>Media Type</TableCell>
							<TableCell>Deal Id</TableCell>
							<TableCell>impressions</TableCell>
							<TableCell>Clicks</TableCell>
							<TableCell>CTR</TableCell>
							<TableCell>Spend</TableCell>
							<TableCell>
								Avg spend per<br /> impression
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{publishlogs.length ? (
							publishlogs.map((row, i) => (
								<TableRow key={i}>
									<TableCell component="th" scope="row">
												{dateformatchanger(row._id.date)}
											</TableCell>
											<TableCell>
												{row.pubname ? row.pubname.publishername : ""}
												{/* {row.nameads && row.nameads} */}
											</TableCell>
											<TableCell />
											<TableCell />
											<TableCell>
												{row.impression >= 0 ? row.impression : row.impression}
											</TableCell>
											<TableCell>
												{row.clicks >= 0 ? row.clicks : row.CompanionClickTracking}
											</TableCell>
											<TableCell>
												{row.clicks >= 0 ? (
													Math.round(row.clicks * 100 / row.impression * 100) / 100
												) : (
													Math.round(
														row.CompanionClickTracking * 100 / row.impression * 100
													) / 100
												)}%
											</TableCell>
											<TableCell>{row.impression ? row.impressions : row.impression}</TableCell>
											<TableCell />
								</TableRow>
							))
						) : (
							'loading or No Data Found'
						)}
					</TableBody>
				</Table>
				
				
			</TableContainer>
			
			
		</div>
	);
}
