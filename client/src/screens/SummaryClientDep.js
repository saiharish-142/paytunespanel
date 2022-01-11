import React, { useEffect, useContext } from 'react';
// import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
// import EnhancedTable from '../components/ClientTable';
import PreLoader from '../components/loaders/PreLoader';
import { clientReportBase, ClientSummDet, idStorer, ReportLoading } from '../redux/actions/reportActions';
import { Breadcrumbs, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import SummaryDetDate from '../components/summaryDetDate';
import { SumDetClientBody, SumDetClientHead } from '../components/CommonFun';
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

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
			if (!report.isLoading && report.issumdetLoading) {
				dispatchRedux(ClientSummDet());
			}
		},
		[ report.isLoading ]
	);
	const updatedatetimeseter = () => {
		// console.log(date)
		// var datee = new Date(date);
		var s = new Date(new Date()).toString();
		// var datee = datee.toString();
		// console.log(s,date,s.split('/'))
		s = s.split(' ');
		// console.log(s);
		return s[2] + '-' + s[1] + '-' + s[3] + ' ' + s[4];
	};
	if (report.isLoading || report.issumdetLoading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	function ExeclDownload(props) {
		// console.log(props);
		const data = React.Children.map(props.children, (child) => {
			// console.log(child);
			if (child.props.dataSet && child.props.dataSet[0].data) {
				return child;
			}
		});
		// console.log(data);
		// console.log(data);
		return (
			<ExcelFile
				filename={props.filename}
				element={
					<Button variant="outlined" color="primary">
						Download Tables
					</Button>
				}
			>
				{data.map((child) => {
					return child;
				})}
			</ExcelFile>
		);
	}
	const DateGen = () => {
		var vamp = {};
		report.sets.map((x) => {
			vamp[x] = [
				{
					columns: SumDetClientHead(x),
					data:
						report.grp_ids[x].length &&
						report.sumdetreport[x] &&
						SumDetClientBody(
							report.sumdetreport[x],
							report.report[x].impressions,
							report.report[x].clicks + report.report[x].clicks1,
							report.report[x].complete,
							x
						)
				}
			];
		});
		return vamp;
	};
	const datesumda = DateGen();
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
			<div className="titleReport">{report.title && report.title.toUpperCase()} Campaign</div>
			<div className="titleReport">Daily report</div>
			<div>last updated at - {updatedatetimeseter()}</div>
			<ExeclDownload filename={`Daily Report ${report.title}`}>
				{report.sets &&
					report.sets.map((x) => {
						return <ExcelSheet dataSet={datesumda[x]} name={`Daily Report ${x}`} />;
					})}
			</ExeclDownload>
			{report.sets &&
				report.sets.map((x) => {
					if (x.toLowerCase() != 'unselected') {
						console.log(report.report[x]);
						return (
							<SummaryDetDate
								report={report.sumdetreport[x]}
								head={x}
								title={report.title && report.title.toUpperCase()}
								state1={campname}
								impression={report.report[x].impressions}
								clicks={report.report[x].clicks + report.report[x].clicks1}
								complete={report.report[x].complete}
							/>
						);
					}
				})}
		</div>
	);
}

export default SummaryClientDep;
