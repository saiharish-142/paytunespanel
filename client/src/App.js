import React, { useEffect, createContext, useReducer } from 'react';
import './App.css';
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { reducer1, InitialState1 } from './reducer.js/idreducer';
import Login from './screens/Login';
import Dashboard from './screens/manageAds';
import Home from './screens/Home';
import Report from './screens/Report';
import DetailedTable from './screens/detailedReport';
// import ClientManage from './screens/ClientManage';
import ClientReport from './screens/ClientReport';
import ManageUser from './screens/ManageUser';
import CampaignBundle from './screens/CampaignBundle';
import DashboardBundle from './screens/manageBundles';
import ReportBundle from './screens/Reportbundle';
import DetailedTableBundle from './screens/detailedReportBundle';
import EditUser from './screens/EditUser';
import Biddata from './screens/biddata';
import Phonedata from './screens/phonedata';
import Zipdata from './screens/zipdata';
import EpisodeTab from './components/episodestab';
import Serverreport from './screens/serverreport'
import { loadUser, networkError } from './redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import Categorydata from './screens/Categorydata';
import PreLoader from './components/loaders/PreLoader';
import { loadRatio } from './redux/actions/currencyAction';
import PublisherConsole from './screens/PublisherConsole';
// import FrequencyConsole from './screens/FrequencyConsole';
import SummaryClientDep from './screens/SummaryClientDep';

export const IdContext = createContext();

function App() {
	const [ state1, dispatch1 ] = useReducer(reducer1, InitialState1);
	const dispatchRedux = useDispatch();
	const [ state, setstate ] = React.useState();
	const user = useSelector((state) => state.auth);
	// console.log(user)
	// window.addEventListener('offline', function(e) {console.log('offline'); });
	// window.addEventListener('online', function(e) { console.log('online');});
	useEffect(() => {
		if (navigator.onLine) {
			dispatchRedux(loadUser());
			dispatchRedux(loadRatio());
		} else {
			dispatchRedux(networkError);
		}
	}, []);
	useEffect(
		() => {
			if (user) {
				if (user.user) {
					setstate(user.user);
				}
			} else {
				return <Redirect to="/login" />;
			}
		},
		[ user ]
	);
	// useEffect(() => {
	// 	fetch('https://free.currconv.com/api/v7/convert?q=USD_INR&compact=ultra&apiKey=30b70a4db3f30dac36bf', {
	// 		method: 'get'
	// 	})
	// 		.then((res) => res.json())
	// 		.then((result) => {
	// 			console.log(result);
	// 			dispatchru({ type: 'ID', payload: result.USD_INR });
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// }, []);
	if (user && user.isLoading) {
		return (
			<React.Fragment>
				<Navbar />
				{/* <MLoader /> */}
				<PreLoader />
			</React.Fragment>
		);
	}
	if (user && !user.isAuthenticated) {
		return (
			<div className="App">
				<Navbar />
				<BrowserRouter>
					<Switch>
						<Route path="/login" render={() => <Login />} />
						<Redirect to="/login" />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
	// console.log(user);
	if (user && user.user.usertype === 'admin') {
		// console.log(user.user.usertype);
		return (
			<IdContext.Provider value={{ state1, dispatch1 }}>
				<div className="App">
					<BrowserRouter>
						<Navbar />
						<Switch>
							<Route path="/" exact render={() => <Home />} />
							<Route path="/manageAds" exact render={() => <Dashboard />} />
							<Route path="/manageAds/:campname" exact render={() => <Report />} />
							<Route path="/manageAds/:campname/detailed" exact render={() => <DetailedTable />} />
							<Route path="/manageBundles" exact render={() => <DashboardBundle />} />
							<Route path="/manageBundles/:campname" exact render={() => <ReportBundle />} />
							<Route
								path="/manageBundles/:campname/detailed"
								exact
								render={() => <DetailedTableBundle />}
							/>
							<Route path="/bundleManage/createbundle" exact render={() => <CampaignBundle />} />
							<Route path="/bundleManage/:bundlename/edit" exact render={() => <CampaignBundle />} />
							<Route path="/manageusers" exact render={() => <ManageUser />} />
							<Route path="/EditUser/:id" exact render={() => <EditUser />} />
							<Route path="/biddata" exact render={() => <Biddata />} />
							<Route path="/publisherdata" exact render={() => <PublisherConsole />} />
							{/* <Route path="/frequencydata" exact render={() => <FrequencyConsole />} /> */}
							<Route path="/phonedata" exact render={() => <Phonedata />} />
							<Route path="/categorydata" exact render={() => <Categorydata />} />
							<Route path="/zipdata" exact render={() => <Zipdata />} />
							<Route path="/episodetabdata" exact render={() => <EpisodeTab />} />
							<Route path="/serverreport" exact render={() => < Serverreport/>} />
							<Route path="/clientSideCamp" exact render={() => <Dashboard clientview={true} />} />
							<Route
								path="/clientSideCamp/:campname"
								exact
								render={() => <ClientReport adminView={true} />}
							/>
							<Route
								path="/clientSideCamp/:campname/summarydetailed"
								exact
								render={() => <SummaryClientDep adminView={true} />}
							/>
							<Redirect to="/" />
						</Switch>
					</BrowserRouter>
				</div>
			</IdContext.Provider>
		);
	}
	return (
		<IdContext.Provider value={{ state1, dispatch1 }}>
			<div className="App">
				<BrowserRouter>
					<Navbar />
					<Switch>
						<Route path="/" exact render={() => (state ? <Home /> : <Redirect to="/login" />)} />
						<Route path="/manageAds" exact render={() => <Dashboard clientdirect={true} />} />
						{/* <Route path="/manageBundles" exact render={() => <DashboardBundle clientdirect={true} />} /> */}
						<Route path="/manageAds/:campname" exact render={() => <ClientReport />} />
						<Route path="/manageAds/:campname/summarydetailed" exact render={() => <SummaryClientDep />} />
						{/* <Route path="/manageBundles/:campname" exact render={() => <ClientReport />} /> */}
						<Redirect to="/" />
					</Switch>
				</BrowserRouter>
			</div>
		</IdContext.Provider>
	);
}
export default App;

{
	/* state ? state.usertype === 'admin' ? (
			<Report />
		) : (
			<ClientReport />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* state ? state.usertype === 'admin' ? (
			<ReportBundle />
		) : (
			<ClientReport />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* <Route
	path="/bundleManage/createbundle"
	exact
	render={() =>
		state ? state.usertype === 'admin' ? (
			<CampaignBundle />
		) : (
			<Redirect to="/manageAds" />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* <Route
	path="/bundleManage/:bundlename/edit"
	exact
	render={() =>
		state ? state.usertype === 'admin' ? (
			<CampaignBundle />
		) : (
			<Redirect to="/manageAds" />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* <Route
	path="/clientSideCamp"
	exact
	render={() =>
		state ? state.usertype === 'admin' ? (
			<DashboardBundle clientview={true} />
		) : (
			<Redirect to="/manageAds" />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* <Route
	path="/manageusers"
	exact
	render={() =>
		state ? state.usertype === 'admin' ? <ManageUser /> : <Home /> : <Redirect to="/login" />}
/>
<Route
	path="/EditUser/:id"
	exact
	render={() =>
		state ? state.usertype === 'admin' ? <EditUser /> : <Home /> : <Redirect to="/login" />}
/> */
}
{
	/* <Route
	path="/clientSideCamp/:campname"
	exact
	render={() =>
		state ? state.usertype === 'admin' ? (
			<ClientReport />
		) : (
			<Redirect to="/manageAds" />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* <Route
	path="/manageAds/:campname/detailed"
	render={() =>
		state ? state.usertype === 'admin' ? (
			<DetailedTable />
		) : (
			<Redirect to={`/manageAds`} />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* <Route
	path="/manageBundles/:campname/detailed"
	exact
	render={() =>
		state ? state.usertype === 'admin' ? (
			<DetailedTableBundle />
		) : (
			<ClientReport />
		) : (
			<Redirect to="/login" />
		)}
/> */
}
{
	/* <Route path="/biddata" exact render={() => (state ? <Biddata /> : <Biddata />)} />
<Route path="/phonedata" exact render={() => (state ? <Phonedata /> : <Phonedata />)} />
<Route path="/zipdata" exact render={() => (state ? <Zipdata /> : <Zipdata />)} />
<Route path="/categorydata" exact render={() => (state ? <Categorydata /> : <Categorydata />)} /> */
}
