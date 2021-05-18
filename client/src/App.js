import React, { useEffect, createContext, useReducer } from 'react';
import './App.css';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { reducer, InitialState } from './reducer.js/reducer';
import { reducer1, InitialState1 } from './reducer.js/idreducer';
import { reducer2, InitialState2 } from './reducer.js/inrreducer';
import Login from './screens/Login';
import Dashboard from './screens/manageAds';
import Home from './screens/Home';
import Report from './screens/Report';
import DetailedTable from './screens/detailedReport';
import ClientManage from './screens/ClientManage';
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
import { loadUser, networkError } from './redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import MLoader from './components/loaders/MLoader';
import NetworkFail from './components/networkFail/NetworkFail';
import Categorydata from './screens/Categorydata';

export const UserContext = createContext();
export const IdContext = createContext();
export const USDINRratioContext = createContext();

function App() {
	const [ state, dispatch ] = useReducer(reducer, InitialState);
	const [ state1, dispatch1 ] = useReducer(reducer1, InitialState1);
	const [ stateru, dispatchru ] = useReducer(reducer2, InitialState2);
	const dispatchRedux = useDispatch();
	const user = useSelector((state) => state.auth);
	// console.log(user)
	// window.addEventListener('offline', function(e) {console.log('offline'); });
	// window.addEventListener('online', function(e) { console.log('online');});
	useEffect(() => {
		if (navigator.onLine) {
			dispatchRedux(loadUser());
		} else {
			dispatchRedux(networkError);
		}
	}, []);
	useEffect(
		() => {
			if (user) {
				dispatch({ type: 'USER', payload: user.user });
			} else {
				return <Redirect to="/login" />;
			}
		},
		[ user ]
	);
	useEffect(() => {
		fetch('https://free.currconv.com/api/v7/convert?q=USD_INR&compact=ultra&apiKey=30b70a4db3f30dac36bf', {
			method: 'get'
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				dispatchru({ type: 'ID', payload: result.USD_INR });
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	if (user && user.networkError) {
		return (
			<React.Fragment>
				<Navbar />
				<NetworkFail />
			</React.Fragment>
		);
	}
	if (user && user.isLoading) {
		return (
			<React.Fragment>
				<Navbar />
				<MLoader />
			</React.Fragment>
		);
	}
	return (
		<UserContext.Provider value={{ state, dispatch }}>
			<USDINRratioContext.Provider value={{ stateru, dispatchru }}>
				<IdContext.Provider value={{ state1, dispatch1 }}>
					<div className="App">
						<BrowserRouter>
							<Navbar />
							<Route
								path="/login"
								render={() => (state ? state.usertype === 'admin' && <Redirect to="/" /> : <Login />)}
							/>
							<Route path="/" exact render={() => (state ? <Home /> : <Redirect to="/login" />)} />
							{state && (
								<React.Fragment>
									<Route
										path="/manageAds"
										exact
										render={() =>
											state ? state.usertype === 'admin' ? (
												<Dashboard />
											) : (
												<ClientManage />
											) : (
												<Redirect to="/login" />
											)}
									/>
									<Route
										path="/manageBundles"
										exact
										render={() =>
											state ? state.usertype === 'admin' ? (
												<DashboardBundle />
											) : (
												<ClientManage />
											) : (
												<Redirect to="/login" />
											)}
									/>
									<Route
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
									/>
									<Route
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
									/>
									<Route
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
									/>
									<Route
										path="/manageusers"
										exact
										render={() =>
											state ? state.usertype === 'admin' ? (
												<ManageUser />
											) : (
												<Home />
											) : (
												<Redirect to="/login" />
											)}
									/>
									<Route
										path="/EditUser/:id"
										exact
										render={() =>
											state ? state.usertype === 'admin' ? (
												<EditUser />
											) : (
												<Home />
											) : (
												<Redirect to="/login" />
											)}
									/>
									<Route
										path="/manageAds/:campname"
										exact
										render={() =>
											state ? state.usertype === 'admin' ? (
												<Report />
											) : (
												<ClientReport />
											) : (
												<Redirect to="/login" />
											)}
									/>
									<Route
										path="/manageBundles/:campname"
										exact
										render={() =>
											state ? state.usertype === 'admin' ? (
												<ReportBundle />
											) : (
												<ClientReport />
											) : (
												<Redirect to="/login" />
											)}
									/>
									<Route
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
									/>
									<Route
										path="/manageAds/:campname/detailed"
										render={() =>
											state ? state.usertype === 'admin' ? (
												<DetailedTable />
											) : (
												<Redirect to={`/manageAds`} />
											) : (
												<Redirect to="/login" />
											)}
									/>
									<Route
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
									/>
									<Route path="/biddata" exact render={() => (state ? <Biddata /> : <Biddata />)} />
									<Route
										path="/phonedata"
										exact
										render={() => (state ? <Phonedata /> : <Phonedata />)}
									/>
									<Route path="/zipdata" exact render={() => (state ? <Zipdata /> : <Zipdata />)} />
									<Route
										path="/categorydata"
										exact
										render={() => (state ? <Categorydata /> : <Categorydata />)}
									/>
								</React.Fragment>
							)}
						</BrowserRouter>
					</div>
				</IdContext.Provider>
			</USDINRratioContext.Provider>
		</UserContext.Provider>
	);
}
export default App;
